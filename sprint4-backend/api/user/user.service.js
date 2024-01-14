import { dbService } from "../../services/db.service.js";
import { loggerService } from "../../services/logger.service.older.js";
import { utilService } from "../../services/util.service.js";

import mongodb from "mongodb";
const { ObjectId } = mongodb;

export const userService = {
  query,
  getById,
  getByUsername,
  remove,
  update,
  add,
  demoUser,
  pushToUsers,
};

async function query(filterBy = {}) {
  const criteria = _buildCriteria(filterBy);
  try {
    const collection = await dbService.getCollection("user");
    var users = await collection
      .find(criteria)
      .sort({ nickname: -1 })
      .toArray();
    users = users.map((user) => {
      delete user.password;
      user.createdAt = ObjectId(user._id).getTimestamp();
      // Returning fake fresh data
      // user.createdAt = Date.now() - (1000 * 60 * 60 * 24 * 3) // 3 days ago
      return user;
    });
    return users;
  } catch (err) {
    loggerService.error("cannot find users", err);
    throw err;
  }
}

async function getById(userId) {
  try {
    const collection = await dbService.getCollection("user");
    const user = await collection.findOne({ _id: new ObjectId(userId) });
    delete user.password;
    return user;
  } catch (err) {
    loggerService.error(`while finding user ${userId}`, err);
    throw err;
  }
}
async function getByUsername(username) {
  try {
    const collection = await dbService.getCollection("user");
    const user = await collection.findOne({ username });
    return user;
  } catch (err) {
    loggerService.error(`while finding user ${username}`, err);
    throw err;
  }
}

async function remove(userId) {
  try {
    const collection = await dbService.getCollection("user");
    await collection.deleteOne({ _id: ObjectId(userId) });
  } catch (err) {
    loggerService.error(`cannot remove user ${userId}`, err);
    throw err;
  }
}

async function update(user) {
  try {
    // peek only updatable fields!
    const userToSave = {
      _id: new ObjectId(user._id),
      trips: user.trips,
      wishlist: user.wishlist,
      myStays: user.myStays,
      guestsReservations: user.guestsReservations,
    };

    const collection = await dbService.getCollection("user");
    await collection.updateOne({ _id: userToSave._id }, { $set: userToSave });
    return user;
  } catch (err) {
    loggerService.error(`cannot update user ${user._id}`, err);
    throw err;
  }
}

async function pushToUsers(from, to, txt) {
  // make the txt -> msg
  //save to from(msg)
  // save to to(msg)
}

async function add(user) {
  try {
    // Validate that there are no such user:
    const existUser = await getByUsername(user.username);
    if (existUser) throw new Error("Username taken");
    if (!user.imgUrl)
      user.imgUrl =
        "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png";

    // peek only updatable fields!
    const userToAdd = {
      username: user.username,
      password: user.password,
      fullname: user.fullname,
      imgUrl: user.imgUrl,
      trips: [],
      wishlist: [],
      myStays: [],
      guestsReservations: [],
      chats: [],
    };
    const collection = await dbService.getCollection("user");
    await collection.insertOne(userToAdd);
    return userToAdd;
  } catch (err) {
    loggerService.error("cannot insert user", err);
    throw err;
  }
}

async function demoUser() {
  try {
    const username = "demo_user";
    const collection = await dbService.getCollection("user");
    let user = await collection.findOne({ username });
    if (!user) {
      user = {
        username: "demo_user",
        password: "123456",
        fullname: "Demo User",
        imgUrl:
          "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png",
        trips: [],
        wishlist: [],
        myStays: [],
        guestsReservations: [],
      };
      const collection = await dbService.getCollection("user");
      await collection.insertOne(user);
    }
    return user;
  } catch (err) {
    loggerService.error("cannot insert user", err);
    throw err;
  }
}

// async function updateTrips(newTrip) {
//   newTrip._id = utilService.makeId();
//   console.log(newTrip.guest._id);
//   const guest = await getById(newTrip.guest._id);
//   //IMPORTENT CHANGE TO HOST
//   const host = await getById(newTrip.guest._id);
//   guest.trips.push(newTrip);
//   host.guestsReservations.push(newTrip);
//   await update(guest);
//   await update(host);
//   // const user = await httpService.put(`user/${_id}`, {_id, score})
//   // When admin updates other user's details, do not update loggedinUser

//   return guest;
// }

// async function updateReservationHost(reservation) {
//   const host = await getById(reservation.host._id);

//   const updatedReservations = host.guestsReservations.map((currRes) =>
//     currRes._id === reservation._id ? reservation : currRes
//   );
//   host.guestsReservations = updatedReservations;
//   await update(host);
//   return host;
// }

function _buildCriteria(filterBy) {
  const criteria = {};
  if (filterBy.txt) {
    const txtCriteria = { $regex: filterBy.txt, $options: "i" };
    criteria.$or = [
      {
        username: txtCriteria,
      },
      {
        fullname: txtCriteria,
      },
    ];
  }
  if (filterBy.minBalance) {
    criteria.balance = { $gte: filterBy.minBalance };
  }
  return criteria;
}
