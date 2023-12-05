var express = require('express');
var path = require('path');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var app = express();

// Use bodyparser to parse the json file
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


// Configure for get routes
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get('/profile-picture', function (req, res) {
    let img = fs.readFileSync(path.join(__dirnamem, "imgs/chameleon.png"));
    res.writeHead(200, { 'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
});

// Used when starting appl locally    
let mongoUrlLocal = 'mongodb://admin:password@localhost:27017';

// Used when starting app as docker container
let mongoUrlDocker = 'mongodb://admin:password@mongodb';

// Pass options to mongo client connect request
let mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };

let databaseName = "user-account";

// if (err) throw err;

//         // Config user account 
//         var db = client.db('user-account');
//         var query = { userid: 1 };
//         db.collection('users').findOne(query, function (err, result) {
//             if (err) throw err;
//             client.close();
//             response.send(result);
//         });
//     });
// });


// Config for post route
app.post('/update-profile', function (req, res) {
    var userObj = req.body;

    // Connect POST req to MongoDB and update entries
    MongoClient.connect(mongoUrlLocal, mongoClientOptions, function (err, client) {
        if (err) throw err;

        let db = client.db(databaseName);
        userObj['userid'] = 1;

        var query = { userid: 1 };
        var newValues = { $set: userObj };

        // console.log('Successful connection established to user-account db');

        db.collection('users').updateOne(query, newValues, { upsert: true }, function (err, res) {
            if (err) throw err;
            client.close();
        });
    });
    // Send response
    response.send(userObj);
});

app.get('/get-profile', function (req, res) {
    let response = {};

    // Connect to db
    MongoClient.connect(mongoUrlLocal, mongoClientOptions, function (err, client) {
        if (err) throw err;

        let db = client.db(databaseName);

        let query = { userid: 1 };

        db.collection("users").findOne(query, function (err, result) {
            if (err) throw err;
            response = result;
            client.close();

            // Send response
            res.send(response ? response : {});
        });
    });
});

app.listen(3000, function () {
    console.log("app listening on port 3000!");
});