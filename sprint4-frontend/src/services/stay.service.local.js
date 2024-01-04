
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'

const STORAGE_KEY = 'stay_db'
_createStays()

export const stayService = {
  query,
  getById,
  save,
  remove,
  getEmptyStay,
  addStayMsg
}
window.cs = stayService


async function query(filterBy = { txt: '', price: 0 }) {
  var stays = await storageService.query(STORAGE_KEY)
  if (filterBy.txt) {
    const regex = new RegExp(filterBy.txt, 'i')
    stays = stays.filter(stay => regex.test(stay.name) || regex.test(stay.summary))
  }
  if (filterBy.price) {
    stays = stays.filter(stay => stay.price <= filterBy.price)
  }
  return stays
}

function getById(stayId) {
  return storageService.get(STORAGE_KEY, stayId)
}

async function remove(stayId) {
  // throw new Error('Nope')
  await storageService.remove(STORAGE_KEY, stayId)
}

async function save(stay) {
  var savedStay
  if (stay._id) {
    savedStay = await storageService.put(STORAGE_KEY, stay)
  } else {
    // Later, owner is set by the backend
    stay.owner = userService.getLoggedinUser()
    savedStay = await storageService.post(STORAGE_KEY, stay)
  }
  return savedStay
}

async function addStayMsg(stayId, txt) {
  // Later, this is all done by the backend
  const stay = await getById(stayId)
  if (!stay.msgs) stay.msgs = []

  const msg = {
    id: utilService.makeId(),
    by: userService.getLoggedinUser(),
    txt
  }
  stay.msgs.push(msg)
  await storageService.put(STORAGE_KEY, stay)

  return msg
}

function getEmptyStay() {
  return {
    name: '',
    price: utilService.getRandomIntInclusive(100, 1000),
  }
}

function _createStays() {
  let stays = utilService.loadFromStorage(STORAGE_KEY)
  if (!stays || !stays.length) {
    stays = [
      {
        _id: "s101",
        name: "Ribeira Charming Duplex",
        type: "House",
        imgUrls: [
          "https://a0.muscache.com/im/pictures/miso/Hosting-5264493/original/10d2c21f-84c2-46c5-b20b-b51d1c2c971a.jpeg?im_w=960", "https://a0.muscache.com/im/pictures/miso/Hosting-5264493/original/e3beaf52-13ab-44ed-bbfa-56ccf43bab98.jpeg?im_w=480",
          "https://a0.muscache.com/im/pictures/miso/Hosting-5264493/original/bc9fdbba-a126-4357-946b-4d5f5581ca0f.jpeg?im_w=480", "https://a0.muscache.com/im/pictures/miso/Hosting-5264493/original/858b29eb-53f3-4707-87a6-444f4375f888.jpeg?im_w=480",
          "https://a0.muscache.com/im/pictures/miso/Hosting-5264493/original/bc9fdbba-a126-4357-946b-4d5f5581ca0f.jpeg?im_w=480", "https://a0.muscache.com/im/pictures/miso/Hosting-5264493/original/d1e6500a-3b0f-451d-8f6e-a6f067930a0d.jpeg?im_w=480",
        ],
        price: 80.00,
        summary: "Fantastic duplex apartment...",
        capacity: 8,
        amenities: [
          "TV",
          "Wifi",
          "Kitchen",
          "Smoking allowed",
          "Pets allowed",
          "Cooking basics"
        ],
        labels: [
          "Top of the world",
          "Trending",
          "Play",
          "Tropical"
        ],
        host: {
          _id: "u101",
          fullname: "Davit Pok",
          imgUrl: "https://a0.muscache.com/im/pictures/fab79f25-2e10-4f0f-9711-663cb69dc7d8.jpg?aki_policy=profile_small",
        },
        loc: {
          area: "Europe",
          country: "Portugal",
          countryCode: "PT",
          city: "Lisbon",
          address: "17 Kombo st",
          lat: -8.61308,
          lng: 41.1413
        },
        reviews: [
          {
            id: "madeId",
            txt: "Very helpful hosts. Cooked traditional...",
            rate: 4,
            by: {
              _id: "u102",
              fullname: "user2",
              imgUrl: "/img/img2.jpg"
            }
          }
        ],
        likedByUsers: ['mini-user']
      },
      {
        _id: "s102",
        name: "Ribeira Charming Duplex",
        type: "House",
        imgUrls: ["https://e26e9b.jpg", "otherImg.jpg"],
        price: 80.00,
        summary: "Fantastic duplex apartment...",
        capacity: 8,
        amenities: [
          "TV",
          "Wifi",
          "Kitchen",
          "Smoking allowed",
          "Pets allowed",
          "Cooking basics"
        ],
        labels: [
          "Top of the world",
          "Trending",
          "Play",
          "Tropical"
        ],
        host: {
          _id: "u101",
          fullname: "Davit Pok",
          imgUrl: "https://a0.muscache.com/im/pictures/fab79f25-2e10-4f0f-9711-663cb69dc7d8.jpg?aki_policy=profile_small",
        },
        loc: {
          area: 'Asia',
          country: "China",
          countryCode: "CN",
          city: "Beijing",
          address: "30 Fui st",
          lat: 39.858139,
          lng: 116.356046
        },
        reviews: [
          {
            id: "madeId",
            txt: "Very helpful hosts. Cooked traditional...",
            rate: 4,
            by: {
              _id: "u102",
              fullname: "user2",
              imgUrl: "/img/img2.jpg"
            }
          }
        ],
        likedByUsers: ['mini-user']
      },
      {
        _id: "s103",
        name: "Urban Central Studio",
        type: "Apartment",
        imgUrls: [
          "https://example.com/apartment1.jpg",
          "https://example.com/apartment2.jpg"
          // ... more image URLs
        ],
        price: 95.00,
        summary: "Cozy studio apartment in the city center with modern amenities.",
        capacity: 4,
        amenities: ["Wifi", "Air Conditioning", "Kitchen", "Washer", "Dryer", "Iron"],
        labels: ["City Life", "Business", "Comfort"],
        host: {
          _id: "u103",
          fullname: "Anna Smith",
          imgUrl: "https://example.com/host2.jpg"
        },
        loc: {
          area: "North America",
          country: "USA",
          countryCode: "US",
          city: "New York",
          address: "500 5th Ave",
          lat: 40.7128,
          lng: -74.0060
        },
        reviews: [
          {
            id: "r102",
            txt: "Great location and fantastic city view!",
            rate: 5,
            by: {
              _id: "u104",
              fullname: "user3",
              imgUrl: "/img/img3.jpg"
            }
          }
        ],
        likedByUsers: ['user4', 'user5']
      },
      {
        _id: "s104",
        name: "Mountain Retreat Lodge",
        type: "Lodge",
        imgUrls: [
          "https://example.com/lodge1.jpg",
          "https://example.com/lodge2.jpg"
          // ... more image URLs
        ],
        price: 130.00,
        summary: "Cozy mountain lodge in the heart of the Rockies, perfect for adventure seekers.",
        capacity: 5,
        amenities: ["Fireplace", "Hot Tub", "Ski Access", "Mountain Bikes", "Hiking Gear", "Panoramic Views"],
        labels: ["Mountain Adventure", "Rustic", "Nature Lover's Paradise"],
        host: {
          _id: "u107",
          fullname: "Emily Johnson",
          imgUrl: "https://example.com/host4.jpg"
        },
        loc: {
          area: "North America",
          country: "Canada",
          countryCode: "CA",
          city: "Banff",
          address: "100 Mountain Peak Rd.",
          lat: 51.178363,
          lng: -115.570769
        },
        reviews: [
          {
            id: "r104",
            txt: "The perfect getaway for outdoor enthusiasts!",
            rate: 4,
            by: {
              _id: "u108",
              fullname: "user9",
              imgUrl: "/img/img9.jpg"
            }
          }
        ],
        likedByUsers: ['user10', 'user11']
      },
    ]
    utilService.saveToStorage(STORAGE_KEY, stays)
  }
}

// TEST DATA
// storageService.post(STORAGE_KEY, {vendor: 'Subali Rahok 2', price: 980}).then(x => console.log(x))




