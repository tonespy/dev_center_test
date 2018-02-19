const google = require('googleapis')
const authentication = require('./google_authentication')
let sheets = google.sheets('v4')

class GoogleSpreadSheet {
    createSheet(spreadsheetName) {
        return new Promise((resolve, reject) => {
            authentication.authenticate().then((auth) => {
                sheets.spreadsheets.create({
                    auth: auth,
                    resource: { properties: { title: spreadsheetName } }
                }, (err, response) => { 
                    return err ? reject(err) : resolve(response) 
                })
            }).catch(err => { 
                return reject(err) 
            })
        })
    }

    appenData(data) {
        return new Promise((resolve, reject) => {
            authentication.authenticate().then((auth) => {
                sheets.spreadsheets.values.append({
                    auth: auth,
                    spreadsheetId: '1tmYemJZCdZ_OCTazjQGt3-AXOH6DpqAmyGzuDF1OR5g',
                    range: 'Sheet1!A:B',
                    valueInputOption: 'USER_ENTERED',
                    insertDataOption: 'INSERT_ROWS',
                    resource: {
                        values: data
                    }
                }, (err, response) => {
                    return err ? reject(err) : resolve(response)
                })
            }).catch(err => {
                return reject(err)
            })
        })
    }
}

module.exports = new GoogleSpreadSheet()