let fs = require('fs');
let readline = require('readline');
let googleAuth = require('google-auth-library');

let SCOPES = ['https://www.googleapis.com/auth/spreadsheets']; 
const TOKEN_DIR = process.cwd() + '/config/'
const TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json'; 

class Authentication {
    authenticate() {
        return new Promise((resolve, reject) => {
            let credentials = this.getClientSecret();
            let authorizePromise = this.authorize(credentials);
            authorizePromise.then(resolve, reject);
        });
    }
    getClientSecret() {
        return require('../config/credentials.json');
    }
    authorize(credentials) {
        const clientSecret = credentials.web.client_secret;
        const clientId = credentials.web.client_id;
        const redirectUrl = credentials.web.redirect_uris[0];
        const auth = new googleAuth();
        const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

        return new Promise((resolve, reject) => {
            // Check if we have previously stored a token.
            fs.readFile(TOKEN_PATH, (err, token) => {
                if (err) {
                    this.getNewToken(oauth2Client).then((oauth2ClientNew) => {
                        resolve(oauth2ClientNew);
                    }, (err) => {
                        reject(err);
                    });
                } else {
                    oauth2Client.credentials = JSON.parse(token);
                    resolve(oauth2Client);
                }
            });
        });
    }
    getNewToken(oauth2Client, callback) {
        return new Promise((resolve, reject) => {
            var authUrl = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: SCOPES
            });
            console.log('Authorize this app by visiting this url: \n ', authUrl);
            var rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question('\n\nEnter the code from that page here: ', (code) => {
                rl.close();
                oauth2Client.getToken(code, (err, token) => {
                    if (err) {
                        console.log('Error while trying to retrieve access token', err);
                        reject();
                    }
                    oauth2Client.credentials = token;
                    this.storeToken(token);
                    resolve(oauth2Client);
                });
            });
        });
    }
    storeToken(token) {
        try {
            fs.mkdirSync(TOKEN_DIR);
        } catch (err) {
            if (err.code != 'EEXIST') {
                throw err;
            }
        }
        fs.writeFile(TOKEN_PATH, JSON.stringify(token));
        console.log('Token stored to ' + TOKEN_PATH);
    }
}

module.exports = new Authentication();