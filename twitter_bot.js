#!/usr/bin/env node
// Import the Twitter API helper
const Twit = require('twit')
const { questions, config } = require('./config/config')
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const csv = require('csvtojson')
const fs = require('fs')
const commander = require('commander')
const { prompt } = require('inquirer');
const spreadsheet = require('./google_spreadsheet/google_spreadsheet')
const authentication = require('./google_spreadsheet/google_authentication')

const Twitter = new Twit(config)

const searchByHashtag = async(hashtags, saveToGSpreadsheet) => {
    const search = await searchHelper(stringModifier(hashtags, /\W+/g, ' OR '))
    if (isError(search)) return search

    const filteredData = search.data.statuses.filter(status => (status.user.followers_count >= 1000 && status.user.followers_count <= 50000))

    let saveTocsv = null
    if (saveToGSpreadsheet) {
        saveTocsv = [null, filteredData]
        saveToGGSS(filteredData)
    } else {
        saveTocsv = await csvHelper(filteredData, hashtags)
        if (isError(saveTocsv)) return saveTocsv
    }

    return saveTocsv[1]
}

const searchHelper = (hashtags) => {
    return new Promise((resolve, reject) => {
        Twitter.get('search/tweets', { q: hashtags, count: 30 }, function(err, data, resp){
            return err ? reject(err) : resolve({data: data, resp: resp})
        })
    })
}

/**
 * csvHelper is a function meant to help with saving users to csv
 * @param {object} data - JSON Object
 * @param {string} hashtags - Hashtag to get users from
 */
const csvHelper = async(data, hashtags) => {
    path = config.path
    csv_name = stringModifier(hashtags, /\W+/g, '_')
    let filterStatus = []

    const files = await readDirHelper(path)
    if (isError(files)) return files

    if (files.length > 0 && files.includes(`${csv_name}.csv`)) {
        let retrieved = await csvReaderHelper(path + csv_name + '.csv')
        if (isError(retrieved)) return retrieved
        filterStatus = retrieved
    }

    if (data instanceof Array) {
        data
            .forEach(element => {
                filterStatus.push({ name: element.user.name, follower_count: element.user.followers_count })
            });
    } else {
        filterStatus.push({ name: data.user.name, follower_count: data.user.followers_count })
    }

    const csvWriter = createCsvWriter({
        path: path + `${csv_name}.csv`,
        header: [
            { id: 'name', title: 'name' },
            { id: 'follower_count', title: 'follower_count' },
        ]
    });

    return Promise.all([csvWriter.writeRecords(filterStatus), filterStatus])
}

const readDirHelper = (path) => {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(path)) {
            fs.readdir(path, (err, files) => {
                return err ? reject(err) : resolve(files)
            })
        } else {
            fs.mkdirSync(path)
            return resolve([])
        }
    })
}

const csvReaderHelper = (csvFilePath) => {
    return new Promise((resolve, reject) => {
        data = []
        csv().fromFile(csvFilePath).on('json', jsonObj => {
            data.push(jsonObj)
        }).on('done', err => {
            return err ? reject(err) : resolve(data)
        })
    })
}

/**
 * StringModifier is an helper function to help
 * with replacing characters in a string
 * 
 * @param {string} hashtags 
 * @param {RegExp} regex 
 * @param {string} word 
 * 
 * @returns {string} modified string
 */
const stringModifier = (hashtags, regex, word) => {
    return hashtags.replace(regex, word)
}

/**
 * An error object checker
 * @param {Error} e 
 * 
 * @returns {boolean} A boolean value representing if it's an error or not
 */
const isError = (e) => {
    return e && e.stack && e.message && typeof e.stack === 'string' && typeof e.message === 'string'
}

/**
 * hashtagstream - Listen for tweets being posted in the provided hashtag
 * @param {string} hashtags 
 */
const hashtagstream = async (hashtags, saveToGSpreadsheet) => {
    let stream = Twitter.stream('statuses/filter', { track: hashtags, language: 'en' })
    const spreadsheetName = stringModifier(hashtags, /\W+/g, '_')

    if (saveToGSpreadsheet) {
        const authenticate = await authentication.authenticate()
        if (isError(authenticate)) {
            console.log('Error Authenticating With Google.')
            return
        }
    }

    stream.on('tweet', (tweet) => {
        if (!saveToGSpreadsheet) {
            csvHelper(tweet, hashtags).then(saveData => {
                console.log("SaveData Count: ", saveData[1].length)
            }).catch(err => process.exit())
        } else {
            const data = [tweet.user.name, tweet.user.followers_count, tweet.user.description]
            saveToGGSS(data)
        }
    })
}

const saveToGGSS = (tweet) => {
    let data = []
    if (tweet[0] instanceof Array) {
        
        tweet.forEach(element => {
            data.push([element.user.name, element.user.followers_count, element.user.description])
        });
    } else { data = [tweet] }

    spreadsheet.appenData(data).then(response => {
        if (data[0] instanceof Array) {
            data.forEach(value => {
                console.log('=================================================================================')
                console.log(`Visit https://docs.google.com/spreadsheets/d/${response.spreadsheetId}/edit#git=0`)
                console.log("User:", value[0])
                console.log("Follower Count:", value[1])
                console.log("Description:", value[2])
                console.log('=================================================================================')
            })
        } else {
            console.log('=================================================================================')
            console.log(`Visit https://docs.google.com/spreadsheets/d/${response.spreadsheetId}/edit#git=0`)
            console.log("User:", data[0])
            console.log("Follower Count:", data[1])
            console.log("Description:", data[2])
            console.log('=================================================================================')
        }
        
    }).catch(err => {
        if (err.message.includes('quota')) {
            console('Write Quota Limit Exceeded')
        } else { console.log(err) }
        process.exit()
    })
}

commander
    .command('fetch')
    .alias('f')
    .description('Fecth Users ')
    .action(() => {
        prompt(questions).then(answers => {
            const hashtags = answers.hashtag
            hashtagstream(stringModifier(hashtags, /\W+/g, ' ,'), answers.gSpread)
        }).catch(err => console.log(err))
    })

commander
    .command('quick_fetch')
    .alias('qf')
    .description('Quick Fecth Users ')
    .action(() => {
        prompt(questions).then(answers => {
            searchByHashtag(stringModifier(answers.hashtag, /\W+/g, ' ,'), answers.gSpread).then(saveData => {
                console.log("SaveData Count: ", saveData.length)
            }).catch(err => process.exit())
        }).catch(err => console.log(err))
    })
commander.parse(process.argv);

module.exports = { searchByHashtag, searchHelper, isError, stringModifier, csvHelper }