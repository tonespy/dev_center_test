const assert = require('assert')
const { searchByHashtag, isError, stringModifier, csvHelper, searchHelper } = require('../twitter_bot')
const data_payload = require('./search_response.json')
let def_hashtag = 'nba, #football, basketball'

describe('Test', () => {

    it('should test if csv saves data', (done) => {
        csvHelper(data_payload.statuses, def_hashtag)
            .then(data => {
                assert.ok(data.length == 2)
                assert.ok(data[1].length > 0)
                done()
            }).catch(err => done(err))
    })

    it('should verify string replace', (done) => {
        const underscore = stringModifier("nba, #football, basketball", /\W+/g, '_')
        assert.equal(underscore, 'nba_football_basketball')

        const orcheck = stringModifier("nba, #football, basketball", /\W+/g, ' OR ')
        assert.equal(orcheck, 'nba OR football OR basketball')

        const andcheck = stringModifier("nba, #football, basketball", /\W+/g, ' AND ')
        assert.equal(andcheck, 'nba AND football AND basketball')
        done()
    });

    it('should test the search helper function', (done) => {
        searchHelper(def_hashtag)
            .then(response => {
                assert.ok(response.data.statuses.length > 0)
                done()
            }).catch(err => done(err))
    }).timeout(5000)

    it('should test hashtag search is working fine:', (done) => {
        searchByHashtag("nba, #football, basketball", false).then(data => {
            assert.ok(data.length > 0)
            done()
        }).catch(err => {
            done(err)
        })
    }).timeout(5000);
})