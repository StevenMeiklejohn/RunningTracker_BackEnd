const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const cors = require("cors");

app.use(cors())

app.use(bodyParser.json());
const MongoClient = require('mongodb').MongoClient;
const createRouter = require('./helpers/create_router.js');

MongoClient.connect('mongodb://localhost:27017')
  .then((client) => {
    const db = client.db('running_tracker');
    const runsCollection = db.collection('runs');
    const runsRouter = createRouter(runsCollection);

    // custom behaviour for CREATE bookings route
    //    Don't allow a booking to be submitted to the 
    //    API unless both the name and email address are present
    //    ... bit of a "belt + braces" approach to stop incomplete
    //    requests (e.g. from insomnia)
    app.post('/api/runs', (req, res) => {
      const newData = req.body;
      if (newData.hasOwnProperty("name") && newData.hasOwnProperty("run_date") && newData.hasOwnProperty("distance")) {
        runsCollection
          .insertOne(newData)
          .then((result) => {
            res.json(result.ops[0]);
          })
          .catch((err) => {
            console.error(err);
            res.status(500);
            res.json({ status: 500, error: err });
          });
      } else {
        res.status(400);  // bad request
        res.send("please make sure run has name and date");
      }
    });

    app.use('/api/runs', runsRouter);
  })
  .catch(console.error);

app.listen(5000, function() {
  console.log(`Run tracker server running on port ${this.address().port}`);
});