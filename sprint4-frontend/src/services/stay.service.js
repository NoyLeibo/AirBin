// import { storageService } from './async-storage.service.js'
import { httpService } from "./http.service.js";
import { utilService } from "./util.service.js";
import { userService } from "./user.service.js";

const STORAGE_KEY = "stay";
const BASE_URL = "stay/";

export const stayService = {
  query,
  getById,
  save,
  remove,
  getEmptyStay,
  // addStay,
  // addStayMsg,
  addStayReview,
  getDefaultFilter,
};
window.cs = stayService;

async function query(filterBy = {}) {
  return httpService.get(BASE_URL, filterBy);
}

function getById(stayId) {
  return httpService.get(`stay/${stayId}`);
}

async function remove(stayId) {
  return httpService.delete(`stay/${stayId}`);
}

// async function addStay(stay) {
//   await httpService.post(`stay/`, stay);
// }

async function save(stay) {
  var savedStay;
  if (stay._id) {
    savedStay = await httpService.put(`stay/${stay._id}`, stay);
  } else {
    savedStay = await httpService.post("stay", stay);
  }
  return savedStay;
}

async function addStayReview(stayId, review) {
  const savedReview = await httpService.post(`stay/${stayId}/review`, {
    txt: review,
  });
  return savedReview;
}

function getEmptyStay() {
  return {
    name: "",
    type: "",
    imgUrls: [],
    price: 40,
    summary: "",
    capacity: 1,
    amentities: [],
    bathrooms: 1,
    bedrooms: 1,
    roomType: "",
    host: {},
    loc: {},
    reviews: [],
    likedByUsers: [],
  };
}

function getDefaultFilter() {
  return {
    placeType: [],
    priceRange: [0, 2000],
    bedrooms: "",
    beds: "",
    bathrooms: "",
    selectedGuests: {
      Adults: 0,
      Children: 0,
      Infants: 0,
      Pets: 0,
    },
    destination: "",
    selectedDates: { checkIn: null, checkOut: null },
    selectedDestination: "",
  };
}
