const mongo = require('mongodb');
const url = "mongodb://localhost:27017/spottikartta"
const express = require('express')
const app = express()

app.use(express.json());

const port = 3001
// TODO: Clean requires and everything

function createSpot(db, name, description, image, lat, long) {
  dbo = db.db("spottikartta");
  // TODO: Handle image as base64
  let newSpot = {name: name, description: description, image: image, lat: lat, long: long}
  console.log(newSpot);
  dbo.collection("spots").insertOne(newSpot, function(err, res) {
    if (err) throw err;
    console.log(`Created a new spot {name}`);
    db.close();
  })
}

function getSpot(db, lat, long) {
  dbo = db.db("spottikartta");

  let query = { lat: lat, long: long }
  dbo.collection("spots").find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log("found spot")
    console.log(result);
    db.close();
  });
}

function updateSpot(db, lat, long, name, description, image) {
  dbo = db.db("spottikartta");

  let query = { lat: lat, long: long }
  let newValues = { $set: { name: newName, description: description, image: image }}
  dbo.collection("spots").updateOne(query, newValues, function(err, res) {
    if (err) throw err;
    console.log(`Spot {existingName} updated`);
    db.close();
  })
}

function createDb() {
  // Attempt to create spottikartta DB if none exists and add default spot
    mongo.MongoClient.connect(url, function(err, db) {
      console.log("database created");
      dbo = db.db("spottikartta");
      dbo.createCollection("spots", function(err, res) {
        console.log("Spot collection created!");
      });
      dbo.collection("spots").insertOne(
        {name: "Turun Parkour Akatemia",
        description: "Turun Parkour Akatemian spotti",
        lat: 60.4593,
        long: 22.274,
        image: null}
      )
      dbo.collection("spots").insertOne(
        {name: "Samppalinnanmäki",
        description: "Samppalinnanmäen spotti",
        lat: 60.4459980,
        long: 22.2688020,
        image: null}
      )
  })
}

app.get('/spot', (req, res) => {
  // GET: Get specific spot
  mongo.MongoClient.connect(url, function(err, db) {
    dbo = db.db("spottikartta");
    console.log(req.query);
    getSpot(db, req.query.lat, req.query.long)
    res.send("")
  })
})

app.post('/spot', (req, res) => {
  // POST: Create new spot
  mongo.MongoClient.connect(url, function(err, db) {
    dbo = db.db("spottikartta");
    console.log(req.body)
    createSpot(db, req.body.name, req.body.description, req.body.image, req.body.lat, req.body.long)
  })
  res.send("");
})

app.put('/spot', (req, res) => {
  // PUT: Edit existing spot
  mongo.MongoClient.connect(url, function(err, db) {
    dbo = db.db("spottikartta");
    console.log("WARN! Spot edit not yet supported");
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  createDb();
})
