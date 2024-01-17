import { MongoClient } from "mongodb";

import { config } from "../config/index.js";
import { loggerService } from "./logger.service.older.js";

export const dbService = {
  getCollection,
  getDbArr,
};

var dbConn = null;

async function getCollection(collectionName) {
  try {
    const db = await _connect();
    const collection = await db.collection(collectionName);
    return collection;
  } catch (err) {
    loggerService.error("Failed to get Mongo collection", err);
    throw err;
  }
}
async function getDbArr(collectionName) {
  const collection = await getCollection(collectionName);
  if (collectionName === 'stay') return await collection.find({}).sort({ rate: -1 }).toArray();
  return await collection.find({}).toArray();

}

async function _connect() {
  if (dbConn) return dbConn;
  try {
    const client = await MongoClient.connect(config.dbURL);
    const db = client.db(config.dbName);
    dbConn = db;
    return db;
  } catch (err) {
    loggerService.error("Cannot Connect to DB", err);
    throw err;
  }
}
