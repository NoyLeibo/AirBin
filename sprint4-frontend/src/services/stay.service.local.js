import { storageService } from "./async-storage.service.js";
import { utilService } from "./util.service.js";
import { userService } from "./user.service.js";

import ConnectedTvOutlinedIcon from "@mui/icons-material/ConnectedTvOutlined";

const STORAGE_KEY = "stay_db";
_createStays();

export const stayService = {
  query,
  getById,
  save,
  remove,
  getEmptyStay,
  addStayMsg,
};
window.cs = stayService;

async function query(filterBy = { txt: "", price: 0 }) {
  var stays = await storageService.query(STORAGE_KEY);
  if (filterBy.txt) {
    const regex = new RegExp(filterBy.txt, "i");
    stays = stays.filter(
      (stay) => regex.test(stay.name) || regex.test(stay.summary)
    );
  }
  if (filterBy.price) {
    stays = stays.filter((stay) => stay.price <= filterBy.price);
  }
  return stays;
}

function getById(stayId) {
  return storageService.get(STORAGE_KEY, stayId);
}

async function remove(stayId) {
  // throw new Error('Nope')
  await storageService.remove(STORAGE_KEY, stayId);
}

async function save(stay) {
  var savedStay;
  if (stay._id) {
    savedStay = await storageService.put(STORAGE_KEY, stay);
  } else {
    // Later, owner is set by the backend
    stay.owner = userService.getLoggedinUser();
    savedStay = await storageService.post(STORAGE_KEY, stay);
  }
  return savedStay;
}

async function addStayMsg(stayId, txt) {
  // Later, this is all done by the backend
  const stay = await getById(stayId);
  if (!stay.msgs) stay.msgs = [];

  const msg = {
    id: utilService.makeId(),
    by: userService.getLoggedinUser(),
    txt,
  };
  stay.msgs.push(msg);
  await storageService.put(STORAGE_KEY, stay);

  return msg;
}

function getEmptyStay() {
  return {
    name: "",
    price: utilService.getRandomIntInclusive(100, 1000),
  };
}

function _createStays() {
  let stays = utilService.loadFromStorage(STORAGE_KEY);
  if (!stays || !stays.length) {
    stays = [
      {
        _id: "s101",
        name: "Ribeira Charming Duplex",
        type: "House",
        imgUrls: [
          "https://a0.muscache.com/im/pictures/miso/Hosting-5264493/original/10d2c21f-84c2-46c5-b20b-b51d1c2c971a.jpeg?im_w=960",
          "https://a0.muscache.com/im/pictures/miso/Hosting-5264493/original/e3beaf52-13ab-44ed-bbfa-56ccf43bab98.jpeg?im_w=480",
          "https://a0.muscache.com/im/pictures/miso/Hosting-5264493/original/bc9fdbba-a126-4357-946b-4d5f5581ca0f.jpeg?im_w=480",
          "https://a0.muscache.com/im/pictures/miso/Hosting-5264493/original/858b29eb-53f3-4707-87a6-444f4375f888.jpeg?im_w=480",
          "https://a0.muscache.com/im/pictures/miso/Hosting-5264493/original/bc9fdbba-a126-4357-946b-4d5f5581ca0f.jpeg?im_w=480",
        ],
        price: 80.0,
        summary: "Fantastic duplex apartment...",
        capacity: 8,
        amenities: [
          "TV",
          "Wifi",
          "Kitchen",
          "Smoking allowed",
          "Pets allowed",
          "Cooking basics",
        ],
        labels: ["Top of the world", "Trending", "Play", "Tropical"],
        host: {
          _id: "u101",
          fullname: "Davit Pok",
          imgUrl:
            "https://a0.muscache.com/im/pictures/user/4f3f9442-aeac-4e00-a04f-7249def79138.jpg?im_w=240",
        },
        loc: {
          area: "Europe",
          country: "Portugal",
          countryCode: "PT",
          city: "Lisbon",
          address: "17 Kombo st",
          lat: -8.61308,
          lng: 41.1413,
        },
        reviews: [
          {
            id: "madeId",
            txt: "Very helpful hosts. Cooked traditional...",
            rate: 4,
            by: {
              _id: "u102",
              fullname: "user2",
              imgUrl: "/img/img2.jpg",
            },
          },
        ],
        likedByUsers: ["mini-user"],
      },
      {
        _id: "s102",
        name: "Regal Residence",
        type: "Luxury stay",
        imgUrls: [
          "https://a0.muscache.com/im/pictures/miso/Hosting-53523185/original/f9885f89-12ba-4e14-8e1d-21cd9a3d6e87.jpeg?im_w=720",
          ,"https://a0.muscache.com/im/pictures/miso/Hosting-53523185/original/270da790-6799-4063-b76f-95161d3dea82.jpeg?im_w=720","https://a0.muscache.com/im/pictures/miso/Hosting-53523185/original/dc860252-c270-4f0f-8fda-841474d3eee9.jpeg?im_w=720",
          "https://a0.muscache.com/im/pictures/miso/Hosting-53523185/original/c57fbbc2-b721-4eaa-93fb-ddea3259fd5f.jpeg?im_w=240","https://a0.muscache.com/im/pictures/miso/Hosting-53523185/original/6dcd73b9-1e3e-4b7d-806d-e38497599b9d.jpeg?im_w=240"
        ],
        price: 3000.0,
        summary: "Fantastic duplex apartment...",
        capacity: 8,
        amenities: [
          "TV",
          "Wifi",
          "Kitchen",
          "Smoking allowed",
          "Pets allowed",
          "Cooking basics",
        ],
        labels: ["Top of the world", "Trending", "Play", "Tropical"],
        host: {
          _id: "u102",
          fullname: "SamuelWorthington",
          imgUrl:
            "https://hwceleb.com/uploads/2017/05/Sam-Worthington-2014-Toronto-International-Film-Festival-283x400.jpg",
        },
        loc: {
          area: "Europe",
          country: "Chania",
          countryCode: "GR",
          city: "Chania",
          address: "30 Fui st",
          lat: 39.858139,
          lng: 116.356046,
        },
        reviews: [
          {
            id: "madeId1",
            txt: "Very helpful hosts. Cooked traditional...",
            rate: 4.5,
            by: {
              _id: "u1021",
              fullname: "Victoria",
              imgUrl: "https://a0.muscache.com/im/pictures/user/41d28f98-0cfd-425e-a700-246afc1a1e42.jpg?im_w=240",
            },
          },
          {
            id: "madeId2",
            txt: "Amazing place and awesome experience!",
            rate: 4.7,
            by: {
              _id: "u1023",
              fullname: "Elizabeth",
              imgUrl: "https://a0.muscache.com/im/pictures/user/2c1ca8cc-c3ec-4556-9f8b-727daa73cade.jpg?im_w=240",
            },
          },
          {
            id: "madeId3",
            txt: "We enjoyed our stay!",
            rate: 4,
            by: {
              _id: "u1032",
              fullname: "Jessica",
              imgUrl: "https://a0.muscache.com/im/pictures/user/User-534308280/original/bc187baf-a742-46b3-9116-747cda4bb4c1.jpeg?im_w=240",
            },
          },
        ],
        likedByUsers: ["mini-user"],
      },
      {
        _id: "s103",
        name: "Sky Haus - A-Frame Cabin",
        type: "Chalet",
        imgUrls: [
          "https://a0.muscache.com/im/pictures/d99ba571-4ea2-453d-8eb3-11459a57a038.jpg?im_w=960",
          "https://a0.muscache.com/im/pictures/miso/Hosting-21783975/original/89c27cb6-210a-4264-8a12-4deb8a144346.jpeg?im_w=480"
          ,"https://a0.muscache.com/im/pictures/miso/Hosting-21783975/original/60851bd6-e722-4d0d-9d5e-75b89e5023bd.jpeg?im_w=480"
          ,"https://a0.muscache.com/im/pictures/54420eb6-920f-4bfb-a1f6-a4b28de5ce5f.jpg?im_w=480","https://a0.muscache.com/im/pictures/miso/Hosting-21783975/original/cf24fd4b-d70f-43a2-a658-2bb0f1249f08.jpeg?im_w=480"
        ],
        price: 720.0,
        summary:
          "Cozy studio apartment in the city center with modern amenities.",
        capacity: 4,
        amenities: [
          "Wifi",
          "Air Conditioning",
          "Kitchen",
          "Washer",
          "Dryer",
          "Iron",
        ],
        labels: ["Nature Life", "Relax", "Comfort"],
        host: {
          _id: "u103",
          fullname: "Tom",
          imgUrl: "https://a0.muscache.com/im/pictures/user/30a19947-9817-4865-90ae-a92dbbf448e9.jpg?im_w=240",
        },
        loc: {
          area: "North America",
          country: "United States",
          countryCode: "US",
          city: "Washington",
          address: "500 5th Ave",
          lat: 40.7128,
          lng: -74.006,
        },
        reviews: [
          {
            id: "r102",
            txt: "Great price, great place super clean. Tom was very helpful in ensuring we got there safely and found the place. It’s very cute and nice little getaway from the city life.",
            rate: 5,
            by: {
              _id: "u10493",
              fullname: "Jenny",
              imgUrl: "https://a0.muscache.com/im/pictures/user/User-85663760/original/5a9949ec-9795-4514-8cfd-4ea995a22235.jpeg?im_w=240",
            },
          },
          {
            id: "r1022",
            txt: "Great location and fantastic city view!",
            rate: 5,
            by: {
              _id: "u1041",
              fullname: "Sydney",
              imgUrl: "https://a0.muscache.com/im/pictures/user/1b42258a-5004-49a6-a657-203822a40e36.jpg?im_w=240",
            },
          },
          {
            id: "r1023",
            txt: "Good location close to Stevens Pass, inside a nice private community. The place was long due for a deeper dust cleaning, but it was not dirty. Felt overpriced for what you get.",
            rate: 5,
            by: {
              _id: "u1042",
              fullname: "Miguel",
              imgUrl: "https://a0.muscache.com/im/pictures/user/d1687aa7-319e-4f6e-83e4-c91fe3ea93d4.jpg?im_w=240",
            },
          },
        ],
        likedByUsers: ["user4", "user5"],
      },
      {
        _id: "s104",
        name: "Mountain Retreat Lodge",
        type: "Lodge",
        imgUrls: [
          "https://a0.muscache.com/im/pictures/e287757a-389d-424b-8863-4651b9303a49.jpg?im_w=960",
          "https://a0.muscache.com/im/pictures/8ccefdd3-d255-48b1-adab-9ffc78f588ce.jpg?im_w=480",
          "https://a0.muscache.com/im/pictures/8ccefdd3-d255-48b1-adab-9ffc78f588ce.jpg?im_w=480",
          "https://a0.muscache.com/im/pictures/8ccefdd3-d255-48b1-adab-9ffc78f588ce.jpg?im_w=480",
          "https://a0.muscache.com/im/pictures/8ccefdd3-d255-48b1-adab-9ffc78f588ce.jpg?im_w=480",
        ],
        price: 130.0,
        summary:
          "Cozy mountain lodge in the heart of the Rockies, perfect for adventure seekers.",
        capacity: 5,
        amenities: [
          "Fireplace",
          "Hot Tub",
          "Ski Access",
          "Mountain Bikes",
          "Hiking Gear",
          "Panoramic Views",
        ],
        labels: ["Mountain Adventure", "Rustic", "Nature Lover's Paradise"],
        host: {
          _id: "u107",
          fullname: "Emily Johnson",
          imgUrl: "https://a0.muscache.com/im/pictures/user/58839044-cbc0-4b04-86be-87a922821ab6.jpg?im_w=240",
        },
        loc: {
          area: "North America",
          country: "Canada",
          countryCode: "CA",
          city: "Banff",
          address: "100 Mountain Peak Rd.",
          lat: 51.178363,
          lng: -115.570769,
        },
        reviews: [
          {
            id: "r104",
            txt: "The perfect getaway for outdoor enthusiasts!",
            rate: 4,
            by: {
              _id: "u108",
              fullname: "user9",
              imgUrl: "/img/img9.jpg",
            },
          },
        ],
        likedByUsers: ["user10", "user11"],
      },
      {
        _id: "s105",
        name: "Iznik Sunshine Lake House",
        type: "Villa",
        imgUrls: [
          "https://a0.muscache.com/im/pictures/miso/Hosting-830369944429615575/original/d61070c5-a687-4042-9bc1-01e2f5a404aa.jpeg?im_w=960",
          "https://a0.muscache.com/im/pictures/95354be8-91ee-48d0-b887-14dc3fb69c83.jpg?im_w=480",
          "https://a0.muscache.com/im/pictures/0e867128-c88a-4f93-8b65-918fdaaf159a.jpg?im_w=480",
          "https://a0.muscache.com/im/pictures/8ce5bc60-4d97-40ad-af1f-a0683d3c45bb.jpg?im_w=480",
          "https://a0.muscache.com/im/pictures/0e867128-c88a-4f93-8b65-918fdaaf159a.jpg?im_w=720"
          // ... more image URLs
        ],
        price: 357.0,
        summary:
          "Cozy mountain lodge in the heart of the Rockies, perfect for adventure seekers.",
        capacity: 5,
        amenities: [
          "Fireplace",
          "Hot Tub",
          "Ski Access",
          "Mountain Bikes",
          "Hiking Gear",
          "Panoramic Views",
        ],
        labels: ["Mountain Adventure", "Rustic", "Nature Lover's Paradise"],
        host: {
          _id: "u107",
          fullname: "Emily Johnson",
          imgUrl: "https://a0.muscache.com/im/pictures/user/91bd3616-a8d5-4342-b45b-1eb76ec17559.jpg?im_w=240",
        },
        loc: {
          area: "North America",
          country: "Canada",
          countryCode: "CA",
          city: "Banff",
          address: "100 Mountain Peak Rd.",
          lat: 51.178363,
          lng: -115.570769,
        },
        reviews: [
          {
            id: "r102",
            txt: "Great price, great place super clean. Tom was very helpful in ensuring we got there safely and found the place. It’s very cute and nice little getaway from the city life.",
            rate: 5,
            by: {
              _id: "u10493",
              fullname: "Jenny",
              imgUrl: "https://a0.muscache.com/im/pictures/user/User-85663760/original/5a9949ec-9795-4514-8cfd-4ea995a22235.jpeg?im_w=240",
            },
          },
          {
            id: "r1022",
            txt: "Great location and fantastic city view!",
            rate: 5,
            by: {
              _id: "u1041",
              fullname: "Sydney",
              imgUrl: "https://a0.muscache.com/im/pictures/user/1b42258a-5004-49a6-a657-203822a40e36.jpg?im_w=240",
            },
          },
          {
            id: "r1023",
            txt: "Good location close to Stevens Pass, inside a nice private community. The place was long due for a deeper dust cleaning, but it was not dirty. Felt overpriced for what you get.",
            rate: 5,
            by: {
              _id: "u1042",
              fullname: "Miguel",
              imgUrl: "https://a0.muscache.com/im/pictures/user/d1687aa7-319e-4f6e-83e4-c91fe3ea93d4.jpg?im_w=240",
            },
          },
        ],
        likedByUsers: ["user10", "user11"],
      },
      {
        _id: "s106",
        name: "Homa pool villa",
        type: "Villa",
        imgUrls: [
          "https://a0.muscache.com/im/pictures/miso/Hosting-678629633136325541/original/a45039d0-198b-4087-8d3d-94c9a4d3c153.png?im_w=960",
          "https://a0.muscache.com/im/pictures/miso/Hosting-678629633136325541/original/c0aef3d9-67c7-48fe-97fc-66f76bf8ae56.jpeg?im_w=480",
          "https://a0.muscache.com/im/pictures/miso/Hosting-678629633136325541/original/7e9ec325-74d3-4287-8583-db131f4d52e6.jpeg?im_w=480",
          "https://a0.muscache.com/im/pictures/miso/Hosting-678629633136325541/original/25e98b05-bd41-4226-8d16-fab64ab861d8.jpeg?im_w=480",
          "https://a0.muscache.com/im/pictures/miso/Hosting-678629633136325541/original/07baeb00-ba96-416e-b164-c1a95fbe4b15.jpeg?im_w=480"
          // ... more image URLs
        ],
        price: 3000.0,
        summary:
          "Cozy mountain lodge in the heart of the Rockies, perfect for adventure seekers.",
        capacity: 5,
        amenities: [
          "Fireplace",
          "Hot Tub",
          "Ski Access",
          "Mountain Bikes",
          "Hiking Gear",
          "Panoramic Views",
        ],
        labels: ["Mountain Adventure", "Rustic", "Nature Lover's Paradise"],
        host: {
          _id: "u107",
          fullname: "Takis",
          imgUrl: "https://a0.muscache.com/im/pictures/user/9aab669f-6ded-4415-a984-4373e81bdb5a.jpg?im_w=240",
        },
        loc: {
          area: "Europe",
          country: "Greece",
          countryCode: "GR",
          city: "Vagia",
          address: "100 Mountain Peak Rd.",
          lat: 51.178363,
          lng: -115.570769,
        },
        reviews: [
          {
            id: "r102",
            txt: "Great price, great place super clean. Tom was very helpful in ensuring we got there safely and found the place. It’s very cute and nice little getaway from the city life.",
            rate: 5,
            by: {
              _id: "u10493",
              fullname: "Jenny",
              imgUrl: "https://a0.muscache.com/im/pictures/user/User-85663760/original/5a9949ec-9795-4514-8cfd-4ea995a22235.jpeg?im_w=240",
            },
          },
          {
            id: "r1022",
            txt: "Great location and fantastic city view!",
            rate: 5,
            by: {
              _id: "u1041",
              fullname: "Sydney",
              imgUrl: "https://a0.muscache.com/im/pictures/user/1b42258a-5004-49a6-a657-203822a40e36.jpg?im_w=240",
            },
          },
          {
            id: "r1023",
            txt: "Good location close to Stevens Pass, inside a nice private community. The place was long due for a deeper dust cleaning, but it was not dirty. Felt overpriced for what you get.",
            rate: 5,
            by: {
              _id: "u1042",
              fullname: "Miguel",
              imgUrl: "https://a0.muscache.com/im/pictures/user/d1687aa7-319e-4f6e-83e4-c91fe3ea93d4.jpg?im_w=240",
            },
          },
        ],
        likedByUsers: ["user10", "user11"],
      },
      {
        _id: "s107",
        name: "Three Bay House - Luxury",
        type: "Villa",
        imgUrls: [
          "https://a0.muscache.com/im/pictures/a98331f6-4b75-427d-a57c-f38f03b498ed.jpg?im_w=960",
          "https://a0.muscache.com/im/pictures/e58c67a8-3020-41b9-acba-7428fd8110ca.jpg?im_w=480",
          "https://a0.muscache.com/im/pictures/d45e9a56-ab5e-455e-ace5-908140237353.jpg?im_w=480",
          "https://a0.muscache.com/im/pictures/887fb43b-0ce6-4dc3-b384-608e2f7a7baa.jpg?im_w=480",
          "https://a0.muscache.com/im/pictures/e3ff854c-d39e-44fd-9311-0508a2717336.jpg?im_w=480"
          // ... more image URLs
        ],
        price: 3000.0,
        summary:
          "Cozy mountain lodge in the heart of the Rockies, perfect for adventure seekers.",
        capacity: 5,
        amenities: [
          "Fireplace",
          "Hot Tub",
          "Ski Access",
          "Mountain Bikes",
          "Hiking Gear",
          "Panoramic Views",
        ],
        labels: ["Mountain Adventure", "Rustic", "Nature Lover's Paradise"],
        host: {
          _id: "u108",
          fullname: "Alfredos",
          imgUrl: "https://a0.muscache.com/im/pictures/user/6f55bece-adfc-47d7-92bc-45ccc5868dd3.jpg?im_w=240",
        },
        loc: {
          area: "Europe",
          country: "Greece",
          countryCode: "GR",
          city: "Vourkari",
          address: "100 Mountain Peak Rd.",
          lat: 51.178363,
          lng: -115.570769,
        },
        reviews: [
          {
            id: "r102",
            txt: "Great price, great place super clean. Tom was very helpful in ensuring we got there safely and found the place. It’s very cute and nice little getaway from the city life.",
            rate: 5,
            by: {
              _id: "u10493",
              fullname: "Jenny",
              imgUrl: "https://a0.muscache.com/im/pictures/user/User-85663760/original/5a9949ec-9795-4514-8cfd-4ea995a22235.jpeg?im_w=240",
            },
          },
          {
            id: "r1022",
            txt: "Great location and fantastic city view!",
            rate: 5,
            by: {
              _id: "u1041",
              fullname: "Sydney",
              imgUrl: "https://a0.muscache.com/im/pictures/user/1b42258a-5004-49a6-a657-203822a40e36.jpg?im_w=240",
            },
          },
          {
            id: "r1023",
            txt: "Good location close to Stevens Pass, inside a nice private community. The place was long due for a deeper dust cleaning, but it was not dirty. Felt overpriced for what you get.",
            rate: 5,
            by: {
              _id: "u1042",
              fullname: "Miguel",
              imgUrl: "https://a0.muscache.com/im/pictures/user/d1687aa7-319e-4f6e-83e4-c91fe3ea93d4.jpg?im_w=240",
            },
          },
         
    ],
      },
      {
        _id: "s120",
        name: "Canava Villas II",
        type: "Villa",
        imgUrls: [
          "https://a0.muscache.com/im/pictures/47b228ee-4089-4bb6-8967-0bccfcc93ad7.jpg?im_w=960",
          "https://a0.muscache.com/im/pictures/7b104a90-b5f3-447d-9144-7b7f7cc17dc3.jpg?im_w=480",
          "https://a0.muscache.com/im/pictures/29d363c8-0814-4b8c-9051-567ecfb37783.jpg?im_w=480",
          "https://a0.muscache.com/im/pictures/33ebaa8a-e0d8-43f3-ae82-a1c5cc208579.jpg?im_w=480",
          "https://a0.muscache.com/im/pictures/074565ff-c80f-47fc-a241-fb04ef65bf95.jpg?im_w=480"
          // ... more image URLs
        ],
        price: 3000.0,
        summary:
          "Cozy mountain lodge in the heart of the Rockies, perfect for adventure seekers.",
        capacity: 5,
        amenities: [
          "Fireplace",
          "Hot Tub",
          "Ski Access",
          "Mountain Bikes",
          "Hiking Gear",
          "Panoramic Views",
        ],
        labels: ["Mountain Adventure", "Rustic", "Nature Lover's Paradise"],
        host: {
          _id: "u108",
          fullname: "Alfredos",
          imgUrl: "https://a0.muscache.com/im/pictures/user/80a17c28-3695-4a20-ad6f-4d569f46e54a.jpg?im_w=240",
        },
        loc: {
          area: "Europe",
          country: "Greece",
          countryCode: "GR",
          city: "Emporio",
          address: "100 Mountain Peak Rd.",
          lat: 51.178363,
          lng: -115.570769,
        },
        reviews: [
          {
            id: "r102",
            txt: "Great price, great place super clean. Tom was very helpful in ensuring we got there safely and found the place. It’s very cute and nice little getaway from the city life.",
            rate: 5,
            by: {
              _id: "u10493",
              fullname: "Jenny",
              imgUrl: "https://a0.muscache.com/im/pictures/user/User-85663760/original/5a9949ec-9795-4514-8cfd-4ea995a22235.jpeg?im_w=240",
            },
          },
          {
            id: "r1022",
            txt: "Great location and fantastic city view!",
            rate: 5,
            by: {
              _id: "u1041",
              fullname: "Sydney",
              imgUrl: "https://a0.muscache.com/im/pictures/user/1b42258a-5004-49a6-a657-203822a40e36.jpg?im_w=240",
            },
          },
          {
            id: "r1023",
            txt: "Good location close to Stevens Pass, inside a nice private community. The place was long due for a deeper dust cleaning, but it was not dirty. Felt overpriced for what you get.",
            rate: 5,
            by: {
              _id: "u1042",
              fullname: "Miguel",
              imgUrl: "https://a0.muscache.com/im/pictures/user/d1687aa7-319e-4f6e-83e4-c91fe3ea93d4.jpg?im_w=240",
            },
          },
        ],
        likedByUsers: ["user10", "user11"],
      }
    ]
    utilService.saveToStorage(STORAGE_KEY, stays)
  }
}