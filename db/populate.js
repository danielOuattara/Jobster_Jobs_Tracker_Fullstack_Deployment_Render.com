require("dotenv").config({ path: "./../.env" });
// require("dotenv").config();
const connectToDB = require("./connect");
const Job = require("./../models/JobModel");
const jobsMockData = require("./mock-data.json");

//----------------------------------------------------------------

connectToDB(process.env.MONGO_URI)
  .then(() => {
    console.log("Connection Success: ready to populate !");
    return Job.deleteMany({});
  })
  .then(() => {
    return Job.create(jobsMockData);
  })
  .then(() => {
    console.log("Populate: Success !");
    process.exit(0);
  })
  .catch((error) => {
    console.log({ ERROR: error.message });
  });

/*
 Note: 
 in Terminal, run : node database/populate.js to execute those populate function 
*/
