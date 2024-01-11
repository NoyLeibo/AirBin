import { ObjectId } from "mongodb";

import { utilService } from "../../services/util.service.js";
import { loggerService } from "../../services/logger.service.js";
import { dbService } from "../../services/db.service.js";

export const stayService = {
  query,
  remove,
  getById,
  add,
  update,
  // addToyMsg,
  // removeToyMsg,
};

async function query(filterBy = {}) {
  const stays = await dbService.getDbArr("stay");
  return stays;
}

async function remove(stayId) {
  try {
    const collection = await dbService.getCollection("stay");
    await collection.deleteOne({ _id: new ObjectId(stayId) });
  } catch (err) {
    loggerService.error(`cannot remove stay ${stayId}`, err);
    throw err;
  }
}

async function getById(stayId) {
  try {
    const collection = await dbService.getCollection("stay");
    const stay = await collection.findOne({ _id: new ObjectId(stayId) });
    return stay;
  } catch (err) {
    loggerService.error(`while finding stay ${stayId}`, err);
    throw err;
  }
}

async function add(stay) {
  try {
    const collection = await dbService.getCollection("stay");
    await collection.insertOne(stay);
    return stay;
  } catch (err) {
    loggerService.error("cannot insert stay", err);
    throw err;
  }
}

async function update(stay) {
  try {
    const stayToSave = {
      name: stay.name,
      price: stay.price,
      type: stay.type,
      imgUrls: stay.imgUrls,
      capacity: stay.capacity,
      roomType: stay.roomType,
      amentities: stay.amentities,
    };
    const collection = await dbService.getCollection("stay");
    await collection.updateOne(
      { _id: new ObjectId(stay._id) },
      { $set: stayToSave }
    );
    return stay;
  } catch (err) {
    loggerService.error(`cannot update stay ${stay._id}`, err);
    throw err;
  }
}
