import { storageService } from "./async-storage.service";
import { httpService } from "./http.service";
import { utilService } from "./util.service";

const STORAGE_KEY_LOGGEDIN_USER = "loggedinUser";
const BASE_URL = "auth/";

export const userService = {
  login,
  logout,
  signup,
  getLoggedinUser,
  saveLocalUser,
  getUsers,
  getById,
  remove,
  update,
  changeScore,
  updateTripList,
  removeTrip,
  updateWishlist,
  updateReservationGuest,
  updateHostReservation,
  removeTripHost,
  // addDemoUser,
};

window.userService = userService;

async function getUsers() {
  const users = (await storageService.query("user")) || [];
  // if (users.length === 0) {
  //   users.push(await addDemoUser());
  // }
  return users;
  // return httpService.get(`user`)
}

// async function getUsers() {
//   return httpService.get(`user`) || [];
// }

async function getById(userId) {
  const user = await httpService.get(`user/${userId}`);
  return user;
}

function remove(userId) {
  return storageService.remove("user", userId);
  // return httpService.delete(`user/${userId}`)
}

async function update(userId, user) {
  const savedUser = await httpService.put(`user/${userId}`, user);
  // When admin updates other user's details, do not update loggedinUser
  if (getLoggedinUser()._id === user._id) saveLocalUser(savedUser);
  return savedUser;
}

async function updateTripList(newTrip) {
  newTrip._id = utilService.makeId();
  const guest = await addTripToGuest(newTrip);
  const host = await addTripToHost(newTrip);
  return guest;
}

async function addTripToGuest(newTrip) {
  const guest = await getById(newTrip.guest._id);
  guest.trips.push(newTrip);
  return await update(guest._id, guest);
}

async function addTripToHost(newTrip) {
  const host = await getById(newTrip.host._id);
  host.guestsReservations.push(newTrip);
  return await update(host._id, host);
}

async function updateHostReservation(reservation) {
  const host = await getById(reservation.host._id);
  const updatedReservations = host.guestsReservations.map((currRes) =>
    currRes._id === reservation._id ? reservation : currRes
  );
  host.guestsReservations = updatedReservations;
  await update(host._id, host);
  saveLocalUser(host);
  return host;
}

// async function updateReservationHost(reservation) {
//   const host = await getById(reservation.host._id);

//   const updatedReservations = host.guestsReservations.map((currRes) =>
//     currRes._id === reservation._id ? reservation : currRes
//   );
//   host.guestsReservations = updatedReservations;
//   await storageService.put("user", host);
//   return host;
// }

async function updateReservationGuest(reservation) {
  const guest = await getById(reservation.guest._id);
  const updatedTrips = guest.trips.map((currRes) =>
    currRes._id === reservation._id ? reservation : currRes
  );
  guest.trips = updatedTrips;
  await update(guest._id, guest);
  return guest;
}

async function removeTrip(reservation) {
  const user = await getById(getLoggedinUser()._id);
  user.trips = user.trips.filter(
    (currReservation) => reservation._id !== currReservation._id
  );
  await update(user._id, user);
  saveLocalUser(user);

  return user;
}

async function removeTripHost(reservation) {
  const user = await getById(reservation.host._id);
  user.guestsReservations = user.guestsReservations.filter(
    (currReservation) => reservation._id !== currReservation._id
  );
  await update(user._id, user);
  saveLocalUser(user);

  return user;
}

async function updateWishlist(wishStay) {
  const user = await getById(getLoggedinUser()._id);
  const isAlreadyInWishlist = user.wishlist.some(
    (currStay) => currStay._id === wishStay._id
  );

  if (isAlreadyInWishlist) {
    user.wishlist = user.wishlist.filter(
      (currStay) => currStay._id !== wishStay._id
    );
  } else {
    user.wishlist.push(wishStay);
  }
  await update(user._id, user);
  saveLocalUser(user);

  return user;
}

// async function login(userCred) {
//   const users = await storageService.query("user");
//   const user = users.find((user) => checkLogin(userCred, user));
//   // const user = await httpService.post('auth/login', userCred)
//   if (user) return saveLocalUser(user);
//   return Promise.reject("Invalid user");
// }

// function checkLogin(userCred, user) {
//   return (
//     userCred.username === user.username && userCred.password === user.password
//   );
// }

async function login(userCred) {
  const user = await httpService.post("auth/login", userCred);
  if (user) return saveLocalUser(user);
  return Promise.reject("Invalid user");
}

// async function signup(userCred) {
//   if (!userCred.imgUrl)
//     userCred.imgUrl =
//       "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png";
//   userCred.trips = [];
//   userCred.wishlist = [];
//   userCred.myStays = [];
//   userCred.guestsReservations = [];

//   const user = await storageService.post("user", userCred);
//   // const user = await httpService.post('auth/signup', userCred)
//   return saveLocalUser(user);
// }

async function signup(userCred) {
  const user = await httpService.post("auth/signup", userCred);
  return saveLocalUser(user);
}

// async function addDemoUser() {
//   const users = await getUsers();
//   let demo = users.find((currUser) => currUser._id === "demo123");
//   if (demo) {
//     return demo;
//   }
//   demo = {
//     username: "demoUser",
//     password: "123456",
//     fullname: "Demo User",
//     imgUrl:
//       "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png",
//     trips: [],
//     _id: "demo123",
//     wishlist: [],
//     myStays: [],
//     guestsReservations: [],
//   };
//   return await storageService.demoUser("user", demo);
// }

async function logout() {
  sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER);
  return await httpService.post("auth/logout");
}

async function changeScore(by) {
  const user = getLoggedinUser();
  if (!user) throw new Error("Not loggedin");
  user.score = user.score + by || by;
  await update(user);
  return user.score;
}

function saveLocalUser(user) {
  user = {
    _id: user._id,
    fullname: user.fullname,
    imgUrl: user.imgUrl,
    username: user.username,
    trips: user.trips,
    wishlist: user.wishlist,
    myStays: user.myStays,
    guestsReservations: user.guestsReservations,
  };
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user));
  return user;
}

function getLoggedinUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER));
}
