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
  addReviewMsg,
  // removeReviewMsg,
};

async function query(filterBy = {}) {
  let stays = await dbService.getDbArr("stay");
  stays = filterStays(filterBy, stays);
  // add filter funcs
  return stays;
}

async function filterStays(filterBy, stays) {
  if (filterBy.priceRange?.length > 0) {
    stays = stays.filter((stay) => isInPriceRange(filterBy.priceRange, stay));
  }
  if (filterBy.bedrooms) {
    stays = stays.filter((stay) => {
      return stay.bedrooms >= filterBy.bedrooms;
    });
  }
  if (filterBy.beds) {
    stays = stays.filter((stay) => {
      return stay.bedrooms >= filterBy.beds;
    });
  }
  if (filterBy.bathrooms) {
    stays = stays.filter((stay) => {
      return stay.baths >= filterBy.bathrooms;
    });
  }
  if (filterBy.placeType?.length) {
    stays = filterStaysByTags(filterBy.placeType, stays);
  }
  return stays;
}

function filterStaysByTags(placeType, stays) {
  const updatedStayArray = stays.filter((stay) => {
    if (!Array.isArray(stay.amenities)) {
      return false;
    }
    return stay.amenities.some((amenity) => placeType.includes(amenity));
  });
  return updatedStayArray;
}

function isInPriceRange(priceRange, stay) {
  const price = stay.price;
  if (price >= +priceRange[0] && price <= +priceRange[1]) {
    return true;
  }
  return false;
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
    //later add all the needed fields of stays
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

async function addReviewMsg(stayId, review) {
  try {
    review.id = utilService.makeId();
    const collection = await dbService.getCollection("stay");
    await collection.updateOne(
      { _id: new ObjectId(stayId) },
      { $push: { reviews: review } }
    );
    return review;
  } catch (err) {
    loggerService.error(`cannot add stay msg ${stayId}`, err);
    throw err;
  }
}
