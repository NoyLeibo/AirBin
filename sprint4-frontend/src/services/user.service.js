import { storageService } from "./async-storage.service";
import { httpService } from "./http.service";

const STORAGE_KEY_LOGGEDIN_USER = "loggedinUser";

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
  updateReservationHost,
};

window.userService = userService;

async function getUsers() {
  const users = await storageService.query("user");
  if (users.length === 0) {
    await userService.signup({
      fullname: "Puki Norma",
      username: "puki",
      password: "123123",
      balance: 10000,
      isAdmin: false,
    });
    await userService.signup({
      fullname: "Master noy",
      username: "NoyLeibo",
      password: "123123",
      balance: 10000,
      isAdmin: true,
    });
    await userService.signup({
      fullname: "Muki G",
      username: "muki",
      password: "123123",
      balance: 10000,
      isAdmin: true,
    });
  }
  return users;
  // return httpService.get(`user`)
}

async function getById(userId) {
  const user = await storageService.get("user", userId);
  // const user = await httpService.get(`user/${userId}`)
  return user;
}

function remove(userId) {
  return storageService.remove("user", userId);
  // return httpService.delete(`user/${userId}`)
}

async function update({ _id, score }) {
  const user = await storageService.get("user", _id);
  user.score = score;
  await storageService.put("user", user);

  // const user = await httpService.put(`user/${_id}`, {_id, score})

  // When admin updates other user's details, do not update loggedinUser
  if (getLoggedinUser()._id === user._id) saveLocalUser(user);
  return user;
}

async function updateTripList(newTrip) {
  const user = await getLoggedinUser();
  newTrip._id = storageService.randomId();
  user.trips.push(newTrip);
  const host = await getById(newTrip.host._id);
  if (!host) {
    return;
  }
  host.guestsReservations.push(newTrip);
  await storageService.put("user", host);
  await storageService.put("user", user);

  // const user = await httpService.put(`user/${_id}`, {_id, score})
  // When admin updates other user's details, do not update loggedinUser
  saveLocalUser(user);
  return user;
}

async function updateReservationHost(reservation) {
  const host = await getById(reservation.host._id);
  const updatedReservations = host.guestsReservations.map((currRes) =>
    currRes._id === reservation._id ? reservation : currRes
  );
  host.guestsReservations = updatedReservations;
  await storageService.put("user", host);
}

async function updateReservationGuest(reservation) {
  const guest = await getById(reservation.host._id);
  const updatedTrips = guest.trips.map((currRes) =>
    currRes._id === reservation._id ? reservation : currRes
  );
  guest.trips = updatedTrips;
  await storageService.put("user", guest);
}

async function removeTrip(tripId) {
  const user = await getLoggedinUser();
  user.trips = user.trips.filter((trip) => tripId !== trip._id);
  await storageService.put("user", user);
  saveLocalUser(user);

  return user;
}

async function updateWishlist(wishStay) {
  const user = await getLoggedinUser();
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
  await storageService.put("user", user);
  saveLocalUser(user);

  return user;
}

async function login(userCred) {
  const users = await storageService.query("user");
  const user = users.find((user) => checkLogin(userCred, user));
  // const user = await httpService.post('auth/login', userCred)
  if (user) return saveLocalUser(user);
  return Promise.reject("Invalid user");
}

function checkLogin(userCred, user) {
  return (
    userCred.username === user.username && userCred.password === user.password
  );
}

async function signup(userCred) {
  if (!userCred.imgUrl)
    userCred.imgUrl =
      "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png";
  userCred.trips = [];
  userCred.wishlist = [];
  userCred.myStays = [];
  userCred.guestsReservations = [];

  const user = await storageService.post("user", userCred);
  // const user = await httpService.post('auth/signup', userCred)
  return saveLocalUser(user);
}

async function logout() {
  sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER);
  // return await httpService.post('auth/logout')
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
