const { MongoClient } = require("mongodb");
 
// Replace the following with your Atlas connection string                                                                                                                                        
const url = "mongodb+srv://stevem:pearljam@runningtrackercluster.gcalw.mongodb.net/test";
const client = new MongoClient(url);
 
 // The database to use
 const dbName = "running_tracker";
                      
 async function run() {
    try {
         await client.connect();
         console.log("Connected correctly to server");
         const db = client.db(dbName);
         // Use the collection "people"
         const col = db.collection("runs");
         // Construct a document                                                                                                                                                              
         let runDocument =   {
            "name": "Steve",
            "run_date": "29-03-2021",
            "distance": 3.2
          }
         // Insert a single document, wait for promise so we can read it back
         const p = await col.insertOne(runDocument);
         // Find one document
         const myDoc = await col.findOne();
         // Print to the console
         console.log(myDoc);
        } catch (err) {
         console.log(err.stack);
     }
 
     finally {
        await client.close();
    }
}
run().catch(console.dir);