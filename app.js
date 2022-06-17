const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const circulationRepo = require('./repos/circulationRepo')
const data = require('./circulation.json')

const url = 'mongodb://bqsistemas:barrantes@127.0.0.1:27017'
const dbName = 'circulation'

async function main() {
    const client = new MongoClient(url)
    try{
        await client.connect()

        const results = await circulationRepo.loadData(data)
        assert.equal(data.length, results.insertedCount)

        // get data
        const getData = await circulationRepo.get({}, 50)
        assert.equal(data.length, getData.length)

        // filter data
        const filterData = await circulationRepo.get({Newspaper: getData[4].Newspaper}, 50)
        assert.equal(filterData[0].Newspaper, getData[4].Newspaper)
        assert.deepEqual(filterData[0], getData[4])

        // limit data
        const limitData = await circulationRepo.get({}, 3)
        assert.equal(limitData.length, 3)
        
    } catch(error) {
        console.log(error)
    } finally {
        const admin = client.db(dbName).admin()
        await client.db(dbName).dropDatabase() // drop databases

        // console.log(await admin.serverStatus())
        console.log(await admin.listDatabases())

        client.close()
    }
}

main();