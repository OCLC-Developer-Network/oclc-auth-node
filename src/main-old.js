var inAppBrowserStrings;
var inAppBrowserCss;
var inAppBrowserJs;
var authorizeComplete = false;
var authorizeLoadedOnce;
var inBrowser;
var authenticationParameters;

/**
 * Remove the authentication tokens from after the hash on the redirectURI.
 * @param URLhash
 * @returns {{}}
 * @private
 */
function _parseTokenResponse(URLhash) {

    var hash = URLhash.replace("#", "").split("&");
    var hashParams = {};
    var paramArray;
    var x;

    for (x = 0; x < hash.length; x++) {
        paramArray = hash[x].split("=");
        hashParams[paramArray[0]] = paramArray[1];
    }

    return hashParams;
}

// we get here if the authorization flow completes and redirects to our redirect_uri with the access token
// on the hashed part of the url (or an error occurs)
function _handleRedirect(url, success, failure) {

    var hash = url.substring(url.indexOf("#"));
    var tokenResponse = _parseTokenResponse(hash);

    // if we have an access token then save it away and proceed
    if (tokenResponse["access_token"]) {

        // recalculate expires_at using the offset (seconds) and current time. we subtract 1 minute for good measure
        tokenResponse["expires_at"] = (new Date()).getTime() + (tokenResponse["expires_in"] * 1000) - 60000;

        if (!tokenResponse["authenticating_institution_id"] || !tokenResponse["context_institution_id"]) {
            failure({message: "institution_id_not_set", status: "institution_id_not_set", detail: ""});
            return;
        }

        // Authentication has completed ... return the parameters
        success(tokenResponse);

    } else {
        failure({
            message: tokenResponse.error,
            status: tokenResponse.http_code,
            detail: tokenResponse.error_description,
            authenticatingInstitutionId: tokenResponse.authenticatingInstitutionId
        });
    }
}

function _setAuthenticationParameters(options) {

    return {
        "WSKEY": options.wskey,
        "AUTH_URL_BASE": options.auth_url_base,
        "AUTH_URL": options.auth_url_base + "authorizeCode?client_id={{wskey}}&redirect_uri={{{redirect_uri}}}&response_type=token&scope={{{scope}}}&state={{{state}}}",
        "DEVICE_SCALE": options.device_scale ? options.device_scale : 1,
        "REDIRECT_URI": options.redirect_uri,
        "TOKEN_REVOKE_URL": options.auth_url_base + "revoke",
        "SCOPE": options.scope,
        "TARGET_VIEW": options.target_view,
        "STORED_AUTH_INSTITUTION": options.stored_auth_institution,
        "STORED_INSTITUTION": options.stored_institution,
        "CLEAR_CACHE": options.clear_cache
    };
}

function _authorizeFlow(options, success, failure) {

    authenticationParameters = _setAuthenticationParameters(options);

    authorizeComplete = false;
    authorizeLoadedOnce = false;

    // initiate the authorization flow.  this will either end with our redirect_uri being invoked OR an error
    // notice the targetView gets added to the state param so that we have access to it in the redirect_uri
    var location = authenticationParameters.AUTH_URL
        .replace("{{wskey}}", authenticationParameters.WSKEY)
        .replace("{{{redirect_uri}}}", encodeURIComponent(authenticationParameters.REDIRECT_URI))
        .replace("{{{scope}}}", encodeURIComponent(authenticationParameters.SCOPE))
        .replace("{{{state}}}", authenticationParameters.TARGET_VIEW);

    if (options.institution) {
        location = location + "&contextInstitutionId=" + options.institution;
    }

    if (options.authInstitution) {
        location = location + "&authenticatingInstitutionId=" + options.authInstitution;
    }

    inBrowser = document.URL.indexOf("http") === 0;

    var authWindowOptions = "hidden=" + (inBrowser ? "no" : "yes")
        + ",location=no"
        + ",toolbar=no"
        + ",enableviewportscale=yes"
        + ",disallowoverscroll=yes"
        + (authenticationParameters.CLEAR_CACHE ? ",clearcache=yes,clearsessioncache=yes" : ",clearcache=no,clearsessioncache=no");

    var authWindow = cordova.InAppBrowser.open(location, "_blank", authWindowOptions);

    function close() {
        if (authWindow) {
            authWindow.close();
            authWindow = null;
        }
    }

    // intercept each request and see if we've reached the end of the auth flow
    authWindow.addEventListener("loadstart", function(event) {

        // hide the inappbrowser until we have a page we know about in loadstop
        authWindow && authWindow.hide();

        var url = event.url.href || event.url;

        if (url.indexOf(options.redirect_uri) === 0) {
            authorizeComplete = true;
            _handleRedirect(url,
                function(tokenResponse) {
                    close();
                    success(tokenResponse);
                }, function(errorResponse) {
                    close();
                    failure(errorResponse);
                });
            return;
        }

        // if it's a window/close, then do so
        if (url.indexOf("window/close") != -1) {
            close();
        }
    });

    function _reskin(page) {

        var code = "var page = '" + page + "';\n" + "var scale = " + authenticationParameters.DEVICE_SCALE + ";\n"
            + "var strings = " + JSON.stringify(inAppBrowserStrings) + ";\n"+ inAppBrowserJs;

        // I'm injecting CSS and JS since the InAppBrowser browser implementation doesn't have insertCSS and executeScript implementations
        if (inBrowser) {
            var iframe = document.getElementsByTagName("iframe")[0];
            var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            var head = iframeDoc.getElementsByTagName("head")[0];
            var style = document.createElement("style");
            var parent = iframe.parentElement;
            style.appendChild(document.createTextNode(inAppBrowserCss));
            head.appendChild(style);
            iframe.contentWindow.eval(code);
            parent.style.background = "white";
            parent.style.borderWidth = "0px";
            return;
        }

        // add the css to the page
        authWindow && authWindow.insertCSS({code: inAppBrowserCss}, function() {
            // execute the javascript for this page passing the scale (if I calculate it while running in the inappbrowser, it seems to have a different one)
            // also make the body visible again after executing the javascript
            authWindow && authWindow.executeScript({code: code}, function() {
                setTimeout(function() {
                    authWindow && authWindow.show();
                }, 1000);
            });
        });
    }

    authWindow.addEventListener("loadstop", function(event) {

        var url = event.url.href || event.url;

        // since loadstart events aren't fired by the browser we handle those here
        if (inBrowser) {

            if (url.indexOf(options.redirect_uri) === 0) {
                authorizeComplete = true;
                _handleRedirect(url,
                    function(tokenResponse) {
                        close();
                        success(tokenResponse);
                    }, function(errorResponse) {
                        close();
                        failure(errorResponse);
                    });
                return;
            }

            if (url.indexOf("window/close") !== -1) {

                close();
                if (!authorizeComplete) {
                    failure({
                        message: "user_cancelled_login",
                        status: "403",
                        detail: "User+cancelled+the+authentication"
                    });
                } else {
                    success();
                }
                return;
            }
        }

        // handle certificate errors
        if (url.indexOf("/oauth2/authorizeCode") !== -1) {

            authorizeComplete = true;
            close();

            failure({
                message: event.type,
                status: event.code,
                detail: event.message ? event.message : "certificate error"
            });

            // wayf or wayfette page
        } else if (url.indexOf("/wayf/metaauth-ui/cmnd/protocol/samlpost") !== -1) {

            authWindow && authWindow.executeScript({code: "document.getElementById('signInChoice') != undefined;"}, function(result) {

                // Must be "==" not "==="
                if (result == "true") {
                    _reskin("wayfette");
                    return;
                }

                _reskin("wayf");
            });

            // wayfette or wayf error page - otherwise just passing through
        } else if (url.indexOf("/wayf/metaauth-ui/cmnd/wayf/selectInstitution") !== -1) {

            authWindow && authWindow.executeScript({code: "document.getElementById('signInChoice') != undefined;"}, function(result) {
                // Must be "==" not "==="
                if (result == "true") {
                    _reskin("wayfette");
                    return;
                }

                authWindow && authWindow.executeScript({code: "document.getElementsByClassName('wms-message-error').length;"}, function(result) {

                    if (result != "0") {
                        _reskin("wayf");
                        return;
                    }
                });
            });

            // idp page
        } else if (url.indexOf("/manageduser-ui/cmnd/useraction/login") !== -1) {

            _reskin("idp");

            // idp error page - style it if displaying an error, otherwise just passing through
        } else if (url.indexOf("/manageduser-ui/cmnd/useraction/samllogin") !== -1) {

            authWindow && authWindow.executeScript({code: "document.getElementsByClassName('uic-error').length;"}, function(result) {
                if (result != "0") {
                    _reskin("idp");
                }
            });

            // authorize page - style it the 2nd time through
        } else if (url.indexOf("/wskeyws/authorize.jsp") !== -1) {

            if (authorizeLoadedOnce) {
                _reskin("authorize");
            } else {
                authorizeLoadedOnce = true;
            }

            // ignore pages - don't do anything
        } else if (url.indexOf("/wayf/metaauth-ui/cmnd/protocol/acs/saml2") !== -1 || url.indexOf(options.redirect_uri) !== -1) {

            // ignore

            // unknown pages - add a close box in case they can't get out
        } else {

            _reskin("unknown");
        }
    });

    authWindow.addEventListener("loaderror", function(event) {

        // the redirect back to localhost should not be considered an error (and we should not show it)
        // this is the exit point when running other than on the browser in development
        if (event.url && event.url.indexOf(options.redirect_uri) === 0) {
            authWindow && authWindow.executeScript({code: "document.write(''); document.close();"});
            return;
        }

        authorizeComplete = true;
        close();

        failure({message: event.type, status: event.code, detail: event.message});
    });

    authWindow.addEventListener("exit", function(event) {

        // if the authorize never completed then redirect back to the login screen
        if (!authorizeComplete) {
            failure({message: "authorization_failed_to_complete", status: "", detail: ""});
        }
    });
}

/**
 * Load InAppBrowser i18n strings, restyling css, js and icon
 * @param done - callback indicating the data read is complete
 * @private
 */
function _readInAppBrowserDataFiles(options, readingCompleteCallback) {

    var css, js;

    _loadStrings(options.locale, function(strings) {
        _readTextFile("style/inappbrowser.css", function(textfile) {
            css = textfile;
            _readTextFile("js/util/inappbrowser.js", function(textfile) {
                js = textfile;
                _readTextFileAsBase64("res/images/oclc.png", function(imageFileBase64) {
                    css = css.replace("{{oclc-icon-base64}}", imageFileBase64);
                    readingCompleteCallback(strings, js, css);
                });
            });
        });
    });
}

function _loadStrings(locale, callback) {

    var language = locale.split("-")[0];

    // read english first in case there isn't a match for the language one
    _readTextFile("res/plugin-strings/strings.json", function(stringsDefault) {
        if (language === "en") {
            callback(JSON.parse(stringsDefault));
        } else {
            _readTextFile("res/plugin-strings/strings_" + locale.split("-")[0] + ".json", function(strings) {
                callback(JSON.parse(strings.startsWith("{") ? strings : stringsDefault));
            });
        }
    });
}

/**
 * Utility function to read a text file
 * @param url
 * @param callback
 * @private
 */
function _readTextFile(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onloadend = function() {
        callback(xhr.responseText);
    };
    xhr.send();
}

/**
 * Utility function to read a base64 encoded file
 * @param url
 * @param callback
 * @private
 */
function _readTextFileAsBase64(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onloadend = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

/**
 * Entry point for authentication. Make sure that parameters are all present, load the inAppBrowser
 * style and script files if not already loaded, and initiate the authentication flow.
 * @param options
 * @param success
 * @param failure
 * @private
 */
function _authorize(options, success, failure) {

    if (options && options.mock) {
        success({
            "access_token": "tk_fzCEJaolYLofdn10wGB1zsyzkUi1Xuds6tS5",
            "state": "app/preflight",
            "principalID": "9073b132-7ac3-40d8-a167-fcd67df7a088",
            "principalIDNS": "urn:oclc:platform:128807",
            "context_institution_id": "128807",
            "authenticating_institution_id": "128807",
            "token_type": "bearer",
            "expires_in": "9999", "expires_at": "3000-01-01 00:00:00Z"
        });

    } else {

        if (!options) {
            console.log("AUTHENTICATION ABORTED - OCLC Authentication Plugin called without options");
        } else if (!success) {
            console.log("AUTHENTICATION ABORTED - OCLC Authentication Plugin called without success function");
        } else if (!failure) {
            console.log("AUTHENTICATION ABORTED - OCLC Authentication Plugin called without failure function");
        } else if (!inAppBrowserJs || !inAppBrowserCss) {
            _readInAppBrowserDataFiles(options, function(strings, js, css) {
                inAppBrowserStrings = strings;
                inAppBrowserJs = js;
                inAppBrowserCss = css;
                _authorizeFlow(options, success, failure);
            });
        } else {
            _authorizeFlow(options, success, failure);
        }
    }
}

/**
 * Revoke a token.
 * @param options
 * @param success
 * @param failure
 * @private
 */
function _revoke(options, success, failure) {

    if (options.mock) {
        success();

    } else {

        var url = options.tokenRevokeUrl + "?access_token=" + options.accessToken;

        var xhr = new XMLHttpRequest();
        xhr.open("PUT", url);
        xhr.onload = function() {
            success();
        }
        xhr.onerror = function() {
            failure();
        }
        xhr.send();
    }
}

module.exports.authorize = _authorize;
module.exports.revoke = _revoke;