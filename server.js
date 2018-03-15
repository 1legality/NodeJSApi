const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

let dbUser   = `<Replace for user name >`;
let dbPass   = `<Replace for db password>`;
let dbServer = `<Replace for server>`;

let dbUrl = `mongodb://${dbUser}:${dbPass}@${dbPass}`;
let db;
MongoClient.connect(dbUrl, (err, database) => {
    if (err) return console.log(err);

    let db = database.db(`localapi`);

    app.listen(3000, () => {

    });

    app.get('/', (req, res) => {
        // Get the documents collection
        const collection = db.collection('documents');

        // Find some documents
        collection.find({}).toArray(function (err, records) {
            assert.equal(err, null);
            console.log(`Found the following records`);
            console.log(records);
            res.send(records);
        });
    });

    // Insert new fields
    app.get(`/insert`, (req, res) => {
            // Get document collection
            const collection = db.collection('documents');

            // Insert document
            collection.insertMany([
                {a: 1}, {a: 2}, {a: 3}
            ], (err, result) => {
                assert.equal(err, null);
                assert.equal(3, result.result.n);
                console.log("Inserted 3 documents into the collection");

                res.redirect('/')
            })

    });

    // Update all fields with 1
    app.get(`/update`, (req, res) => {
        const collection = db.collection('documents');

        // Update many
        let myQuery = { };
        let newValues = {$set: {a: 1}};
        collection.updateMany(myQuery, newValues, (err, result) => {
            console.log(`all a should be 1`);

            res.redirect('/');
        })
    });

    // Delete with tag ID
    app.get(`/del/:tagId`, (req, res) => {
        try {
            const collection = db.collection('documents');

            let tagId = Number.parseInt(req.params.tagId);

            console.log(`Deleting all field with tagId ${tagId}`);
            // Delete many
            let myQuery = {a: tagId};
            collection.deleteMany(myQuery, (err, result) => {
                if (err) throw err;

                console.log(result.result.n + ` document(s) deleted`);
                res.redirect('/')
            })
        }
        catch (err) {
            console.log(err);
            res.redirect('/');
        }
    });

    // Delete the whole collection
    app.get(`/delAll`, (req, res) => {
        const collection = db.collection('documents');

        collection.drop((err, delOk) => {
            if (err) throw err;

            if (delOk) console.log(`removed documents collections`);
            res.redirect('/');
        })
    })
});