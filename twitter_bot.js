#!/usr/bin/env node
// Import the Twitter API helper
const Twit = require('twit')
const { questions, config } = require('./config')
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const csv = require('csvtojson')
const fs = require('fs')
const commander = require('commander')
const { prompt } = require('inquirer');

const Twitter = new Twit(config)

const searchByHashtag = async(hashtags) => {
    const search = await searchHelper(stringModifier(hashtags, /\W+/g, ' OR '))
    if (isError(search)) return search

    const saveTocsv = await csvHelper(search.data.statuses, hashtags)
    if (isError(saveTocsv)) return saveTocsv

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
            .filter(status => (status.user.followers_count >= 1000 && status.user.followers_count <= 50000))
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
const hashtagstream = async(hashtags) => {
    let stream = Twitter.stream('statuses/filter', { track: hashtags, language: 'en' })
    stream.on('tweet', (tweet) => {
        csvHelper(tweet, hashtags).then(saveData => {
            console.log("SaveData Count: ", saveData[1].length)
        }).catch(err => stream.stop())
    })
}

commander
    .command('fetch')
    .alias('f')
    .description('Fecth Users ')
    .action(() => {
        prompt(questions).then(answers => {
            const hashtags = answers.hashtag
            hashtagstream(stringModifier(hashtags, /\W+/g, ' ,'))
        }).catch(err => console.log(err))
    })

commander
    .command('quick_fetch')
    .alias('qf')
    .description('Quick Fecth Users ')
    .action(() => {
        prompt(questions).then(answers => {
            searchByHashtag(stringModifier(answers.hashtag, /\W+/g, ' ,')).then(saveData => {
                console.log("SaveData Count: ", saveData.length)
            }).catch(err => stream.stop())
        }).catch(err => console.log(err))
    })
commander.parse(process.argv);

module.exports = { searchByHashtag, searchHelper, isError, stringModifier, csvHelper }