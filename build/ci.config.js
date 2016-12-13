var git = require('git-rev-sync');
var config = {
    url: 'https://login.salesforce.com',
    packageName: 'SF_PACKAGE_NAME',
    testLevel: 'RunLocalTests',
    runDeleteScript: false,
    checkOnly: false,
    ignoreWarnings: true,
};
var gitBranch = git.branch();
var authConfig;
if(process.env['CI']){
    authConfig = {
        username: process.env[gitBranch.toUpperCase().replace('.','_') + '_USERNAME'],
        password: process.env[gitBranch.toUpperCase().replace('.','_') + '_PASSWD'],
        refreshToken: process.env[gitBranch.toUpperCase().replace('.','_') + '_TOKEN'],
        clientId: process.env['CLIENTID'],
        clientSecret: process.env['CLIENTSECRET']
    }
}
else {
    authConfig = require('./build.properties.'+gitBranch);
}
module.exports = Object.assign(config, authConfig);
