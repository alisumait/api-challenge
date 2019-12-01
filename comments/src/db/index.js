require("dotenv").config();
const mongoose = require("mongoose");
const { MongoMemoryServer }= require("mongodb-memory-server");
let DB_URI = process.env.MONGO_DB_URI;
let mongod;

if (process.env.NODE_ENV == "test") {
  mongod = new MongoMemoryServer({});
}

// used for unit test virtual DB connection
async function connectTestDatabase() {
  const uri = await mongod.getConnectionString();
  const mongooseOpts = {
    autoReconnect: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000
  };
  await mongoose.connect(uri, mongooseOpts);
}

// used for unit test to drop and disconnect virtual DB
async function clearTestDatabase() {
  await mongoose.connection.dropDatabase();
}

// used for unit test to drop and disconnect virtual DB
async function closeTestDatabse() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
}

async function connect() {
  console.log("Connecting to Database..");
  await mongoose
    .connect(
      DB_URI,
      { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
      () => {
        console.log("Connected!");
      }
    )
    .catch(err => console.log(err));
}

function close() {
  return mongoose.disconnect();
}

module.exports = {
  connect, close, connectTestDatabase,
  clearTestDatabase,
  closeTestDatabse
};
