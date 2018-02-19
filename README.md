## Back-end Developer Test

### Devcenter Backend Developer Test I

The purpose of this test is not only to quickly gauge an applicant's abilities with writing codes, but also their approach to development.

Applicants may use whatever language they want to achieve the outcome.

## Task

Build a bot that extracts the following from people’s Twitter bio (on public/open accounts), into a Google spreadsheet:

* Twitter profile name 
* Number of followers

Target accounts using either of these criteria:
* Based on hashtags used
* Based on number of followers; Between 1,000 - 50,000

## How to complete the task

1. Fork this repository into your own public repo.

2. Complete the project and commit your work. Send the URL of your own repository to @seun on the Slack here bit.ly/dcs-slack.

## Show your working

If you choose to use build tools to compile your CSS and Javascript (such as SASS of Coffescript) please include the original files as well. You may update this README file outlining the details of what tools you have used.

## Clean code

This fictitious project is part of a larger plan to reuse templates for multiple properties. When authoring your CSS ensure that it is easy for another developer to find and change things such as fonts and colours.


## Good luck!

We look forward to seeing what you can do. Remember, although it is a test, there are no specific right or wrong answers that we are looking for - just do the job as best you can. Any questions - create an issue in the panel on the right (requires a Github account).

## Solution

The bot provides the following features
* Search for tweets in a hashtag
* Listen for tweets being posted in a hashtag

The bot uses the following Node packages
* command-line interfaces: [commander](https://github.com/tj/commander.js/)
* command-line prompt: [inquirer](https://github.com/SBoudrias/Inquirer.js#documentation)
* csvtojson for converting csv to json: [csvtojson](https://github.com/Keyang/node-csvtojson)
* csv-writer convert objects/arrays to csv: [csv-writer](https://github.com/ryu1kn/csv-writer)
* mocha for testing: [mocha](https://mochajs.org/)
* twit, twitter api client holder: [twit](https://github.com/ttezel/twit)
* Google APIs, Googgle api client: [googleapis](https://www.npmjs.com/package/googleapis)
* Google OAuth, google-auth-library client: [google-auth-library](https://www.npmjs.com/package/google-auth-library)

# Getting Started

### Installing modules
Setup node by going to [NodeJs](https://nodejs.org/en/)

```
# go into project root directory and install packages
npm install
```

### Setup Config keys by creating a twitter App [here](https://apps.twitter.com/)
```
Modify keys in config.js to include 
Note: You can put the key there directly instead of adding it to the environmental variable itself.

config = {
    consumer_key: process.env.bot_twitter_consumer_key,
    consumer_secret: process.env.bot_twitter_consumer_secret,
    access_token: process.env.bot_twitter_access_token,
    access_token_secret: process.env.bot_twitter_access_token_secret,
    path: './out/'
}
```

### Get Google Configuration file
* Login to your google account
* Use [this wizard](https://console.developers.google.com/start/api?id=sheets.googleapis.com) to create or select a project in the Google Developers Console and automatically turn on the API.
* After landing to the console page, click `Continue` button.
* Now click on `Go to credentials button`.
* On the Add credentials to your project page, click the Cancel button.
* Click on the `OAuth consent screen tab`.
* Select an Email address, enter a Product name if not already set, and click the `Save` button.
* Select the Credentials tab (probably it’s already selected by now), click the `Create credentials` button and select `OAuth client ID`.
* Select the application type Other and enter the name “WhatsoeverYouWant”, and click the Create button.
* Click OK to dismiss the resulting dialog.
* You should see a download icon at the right side. Click on this to download the json file containing credentials.
* Rename the file as `credentials.json` and save in the `config.json` in the `config` directory located in the root of the project

For more info on quick guide with google spreadsheet
[Paul Shaun's Blog](http://voidcanvas.com/node-js-googleapis-v4-spreadsheet/)

### Running Project
```
# For a quick search
npm run qs

# For a bot that runs until it terminates after an error
npm run bot
```

## Testing Project
```
# To test project, run:
npm test

# or install mocha globally ( npm install mocha -g) and run
mocha
```

## Possible Improvements
* Code cleanup by moving helper functions into another file
* Provide user with more functionalities rather than just limiting them to only provide hashtags(E.g: Provide mas number of tweets being expected etc)
* More and more tests

## Demo
![screen shot](https://user-images.githubusercontent.com/8668661/33088863-330b4250-ceef-11e7-9e9c-b4fd9ca299d8.gif)
