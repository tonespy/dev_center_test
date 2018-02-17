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

# Getting Started

### Installing modules
Setup node by going to [NodeJs](https://nodejs.org/en/)

```
# go into project root directory and install packages
npm install
```

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

## Demo
![screen shot](https://user-images.githubusercontent.com/8668661/33088863-330b4250-ceef-11e7-9e9c-b4fd9ca299d8.gif)
