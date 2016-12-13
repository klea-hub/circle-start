var request = require('sync-request');
var jsforce = require('cs-jsforce');
var accessToken;
var jsonResponse;

var updateAuthOptions = function(ciconfig, options){
    if(process.env['CI']){
        var accessToken;
        if(ciconfig.refreshToken != '' && ciconfig.refreshToken != null && typeof ciconfig.refreshToken != 'undefined'){
            jsonResponse = getAccessTokenFromRefreshToken(ciconfig.url, ciconfig.clientId, ciconfig.clientSecret, ciconfig.refreshToken);
        }
        else {
            jsonResponse = getAccessTokenFromUsernamePassword(ciconfig.url, ciconfig.clientId, ciconfig.clientSecret, ciconfig.username, ciconfig.password);
        }
        var conn = new jsforce.Connection({ 
            accessToken: jsonResponse.access_token,
            instanceUrl: jsonResponse.instance_url,
            loginUrl: ciconfig.url,
            oauth2: {
                clientId: ciconfig.clientId,
                clientSecret: ciconfig.clientSecret,
                redirectUri: ciconfig.url
            }
        });
        options.connection = conn;
    }
    else {
        options.loginUrl = ciconfig.url;
        options.username = ciconfig.username;
        options.password = ciconfig.password;
    }
    return options;
};

var getAccessTokenFromRefreshToken = function(url, clientId, clientSecret, refreshToken){
    var endpoint = url+'/services/oauth2/token?client_id='+clientId+'&client_secret='+clientSecret+'&grant_type=refresh_token&refresh_token='+refreshToken;
    return getSalesforceToken(endpoint);
};

var getAccessTokenFromUsernamePassword = function(url, clientId, clientSecret, username, password){
    var endpoint = url+'/services/oauth2/token?client_id='+clientId+'&client_secret='+clientSecret+'&grant_type=password&username='+username+'&password='+password;
    return getSalesforceToken(endpoint);
};

var getSalesforceToken = function(url){
    console.log('Getting Salesforce Access Token');
    var res = request('POST', url, {
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    var responseJSON = JSON.parse(res.getBody('utf8'));
    console.log(responseJSON.access_token);
    return responseJSON;
};

module.exports.updateAuthOptions = updateAuthOptions;
