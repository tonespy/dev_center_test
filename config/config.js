//config.js
/** TWITTER APP CONFIGURATION
 * consumer_key
 * consumer_secret
 * access_token
 * access_token_secret
 */
const config = {
    consumer_key: process.env.bot_twitter_consumer_key,
    consumer_secret: process.env.bot_twitter_consumer_secret,
    access_token: process.env.bot_twitter_access_token,
    access_token_secret: process.env.bot_twitter_access_token_secret,
    path: './out/'
}

const questions = [
    {
        type: 'input',
        name: 'hashtag',
        message: 'Enter hashtag(s) separated by comma or space (nba, #basketall football, javelin)'
    },
    {
        type: 'confirm',
        name: 'gSpread',
        message: 'Would you like to save it to a Google Spreadsheet file, or have it save it to a csv file locally? Yes=Google, No=Localy (default = yes)'
    }
];

module.exports = { questions, config }