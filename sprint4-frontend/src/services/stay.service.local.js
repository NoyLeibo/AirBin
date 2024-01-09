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

async function query(
  filterBy = {
    placeType: [],
    priceRange: [0, 2000],
    bedrooms: "",
    beds: "",
    bathrooms: "",
  }
) {
  console.log(filterBy);
  var stays = await storageService.query(STORAGE_KEY);
  // if (filterBy.txt) {
  //   const regex = new RegExp(filterBy.txt, "i");
  //   stays = stays.filter(
  //     (stay) => regex.test(stay.name) || regex.test(stay.summary)
  //   );
  // }

  // if (filterBy.price) {
  //   stays = stays.filter((stay) => stay.price <= filterBy.price);
  // }
  if (filterBy.priceRange.length > 0) {
    stays = stays.filter((stay) => isInPriceRange(filterBy.priceRange, stay));
  }
  if (filterBy.bedrooms) {
    stays = stays.filter((stay) => {
      return stay.bedrooms === filterBy.bedrooms;
    });
  }
  if (filterBy.placeType.length > 0) {
    stays = filterStaysByTags(filterBy.placeType, stays);
  }
  console.log(stays);
  return stays;
}

function filterStaysByTags(placeType, stays) {
  const updatedStayArray = stays.filter((stay) => {
    // Check if any tag from tagArray is present in the stay's tags
    return placeType.includes(stay.type);
  });

  return updatedStayArray;
}

function isInPriceRange(priceRange, stay) {
  const price = stay.price;
  if (price >= priceRange[0] && price <= priceRange[1]) {
    return true;
  }
  return false;
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
    price: "",
    type: "",
    imgUrls: [],
    summary: "",
    stayPlace: "",
    stayDetail: {
      capacity: 0,
      beds: 0,
      rooms: 0,
      bathrooms: 0,
    },
    amenities: [],
    labels: [],
    host: {
      _id: "",
      fullname: "",
      imgUrl:
        "",
    },
    loc: {
      area: "",
      country: "",
      countryCode: "",
      city: "",
      address: "",
      lat: 0,
      lng: 0,
    },
    reviews: [],
    likedByUsers: [],

  };
}
function _createStays() {
  let stays = utilService.loadFromStorage(STORAGE_KEY);
  if (!stays || !stays.length) {
    stays = [
      {
        _id: "s101",
        name: "Beachfront Villa",
        type: "Villa",
        imgUrls: [
          "https://a0.muscache.com/im/pictures/miso/Hosting-842844862546384405/original/06e6395b-a488-49d5-ad6d-43e17331dc15.jpeg?im_w=720",
          "https://a0.muscache.com/im/pictures/miso/Hosting-842844862546384405/original/d74b1bc2-bf0a-4b89-b19a-fd3bb6690d79.jpeg?im_w=720",
          "https://a0.muscache.com/im/pictures/miso/Hosting-842844862546384405/original/d02f9742-9ceb-4736-95f9-3dfc601f3a7c.jpeg?im_w=720",
          "https://a0.muscache.com/im/pictures/miso/Hosting-842844862546384405/original/765e5508-233e-468b-98df-c45e475179b8.jpeg?im_w=720",
          "https://a0.muscache.com/im/pictures/miso/Hosting-842844862546384405/original/e02c29bb-30a1-484d-ba58-b4cffa91fc5f.jpeg?im_w=1200",
        ],
        price: 1200.0,
        bedrooms: 4,
        beds: 7,
        baths: 3,
        summary: "Beautiful villa with direct access to the beach...",
        capacity: 6,
        amenities: ["Breakfasts", "Top of the world", "Mansions", "Rooms", "Historial homes", "Chef kitchens"],
        labels: ["Beach", "Family", "Sunset View"],
        host: {
          _id: "u105",
          fullname: "Maria Gonzalez",
          imgUrl:
            "https://a0.muscache.com/im/pictures/user/d7f7361f-9b5d-4780-a3cf-029a10bdcc1e.jpg?im_w=240",
          hostingYears: 3,
          ownerReview: `Amazing luxury apartment, located in a new residential project with luxurious lobby and 24/7 security.
          The apartment overlooks the sea and the entire city of Tel Aviv from it's extra large and shaded balcony on the 27th floor.
          There are 2 spacious bedrooms, closets, full size tub, pampering living room wits smart TV, fully equipped kitchen: dishwasher, a Nespresso machine, dining area, AC, washing machine, dryer & more!`
        },
        loc: {
          area: "Caribbean",
          country: "Bahamas",
          countryCode: "BS",
          city: "Nassau",
          address: "22 Ocean Breeze Ave",
          lat: -77.39628,
          lng: 25.03428,
        },
        reviews: [
          {
            id: "r212",
            txt: "Absolutely breathtaking scenery, the villa was beyond our expectations.",
            rate: 5,
            by: {
              _id: "u219",
              fullname: "Anna Thompson",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/223db29f-2507-412c-bba8-510446c3502e.jpg?im_w=240",
            },
          },
          {
            id: "r213",
            txt: "Incredible service and luxurious amenities. Felt like royalty!",
            rate: 5,
            by: {
              _id: "u220",
              fullname: "Mark Evans",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/2460542d-1a13-4bca-b269-53eff2d04c9c.jpg?im_w=240",
            },
          },
          {
            id: "r214",
            txt: "A slice of heaven on earth. The private beach access was a dream.",
            rate: 5,
            by: {
              _id: "u221",
              fullname: "Natalie Young",
              imgUrl:
                "https://a0.muscache.com/im/users/12801203/profile_pic/1432018804/original.jpg?im_w=240",
            },
          },
          {
            id: "r215",
            txt: "Every detail was perfect, from the stunning interiors to the lush gardens.",
            rate: 5,
            by: {
              _id: "u222",
              fullname: "Ethan Murphy",
              imgUrl:
                "https://a0.muscache.com/im/users/10659131/profile_pic/1402608909/original.jpg?im_w=240",
            },
          },
          {
            id: "r216",
            txt: "The best sunset views we've ever seen! Can't wait to return.",
            rate: 5,
            by: {
              _id: "u223",
              fullname: "Grace Lee",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/44d26f4d-0b4f-4d07-a31c-397abfffce0b.jpg?im_w=240",
            },
          },
          {
            id: "r217",
            txt: "Luxury at its best! The staff made our stay unforgettable.",
            rate: 5,
            by: {
              _id: "u224",
              fullname: "Oliver Martinez",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/37643aad-005b-47c7-ad41-1f478af04816.jpg?im_w=240",
            },
          },
        ],
        likedByUsers: ["luxury-seeker", "serenity-lover"],
      },
      {
        _id: "s111",
        name: "Tranquil Beachfront Oasis",
        type: "Villa",
        imgUrls: [
          "https://a0.muscache.com/im/pictures/miso/Hosting-965149645977028534/original/8378355d-c127-4037-8b3b-cdb111c869d7.jpeg?im_w=1200",
          "https://a0.muscache.com/im/pictures/miso/Hosting-965149645977028534/original/9d0cbcd4-4f2c-492d-bc08-d57f44aded62.jpeg?im_w=720",
          "https://a0.muscache.com/im/pictures/miso/Hosting-965149645977028534/original/76205948-69bb-4ad3-8d84-607fbfb8ee26.jpeg?im_w=1200",
          "https://a0.muscache.com/im/pictures/miso/Hosting-965149645977028534/original/2a5776e3-5014-4deb-aea1-b8747a4d0103.jpeg?im_w=1200",
          "https://a0.muscache.com/im/pictures/miso/Hosting-965149645977028534/original/3965820c-e88d-42be-a232-52f5edf333fe.jpeg?im_w=720",
          // "https://a0.muscache.com/im/pictures/miso/Hosting-965149645977028534/original/d8ad988e-726d-412a-8d5a-5ce6bdfb80a1.jpeg?im_w=1200",
          // "https://a0.muscache.com/im/pictures/miso/Hosting-965149645977028534/original/e98163f6-1b99-4ada-b2e1-710cd743d840.jpeg?im_w=720",
          // "https://a0.muscache.com/im/pictures/miso/Hosting-965149645977028534/original/e63a0d1f-336c-4bbe-8e80-548cb7761198.jpeg?im_w=1200"
        ],
        price: 150.0,
        summary:
          "Luxurious villa offering serene beachfront views and lush tropical gardens...",
        capacity: 6,
        amenities: ["Historial homes", "Play", "Creative spaces", "Beachfront", "Rooms", "Trending"],
        labels: ["Luxury", "Beachfront", "Tropical Paradise"],
        host: {
          _id: "u111",
          fullname: "Achara Boonsri",
          imgUrl:
            "https://a0.muscache.com/im/pictures/user/010358d4-feff-433f-89d2-d3e8560d07a5.jpg?im_w=240",
        },
        loc: {
          area: "Asia",
          country: "Thailand",
          countryCode: "TH",
          city: "Phuket",
          address: "88 Coastal Road, Patong",
          lat: 7.8804,
          lng: 98.3923,
        },
        reviews: [
          {
            id: "r206",
            txt: "The infinity pool is just amazing - spent most of our time enjoying the view!",
            rate: 5,
            by: {
              _id: "u213",
              fullname: "James Carter",
              imgUrl:
                "https://a0.muscache.com/im/users/23331610/profile_pic/1415110296/original.jpg?im_w=240",
            },
          },
          {
            id: "r207",
            txt: "Waking up to the sound of the waves was just what we needed. Truly a piece of paradise.",
            rate: 5,
            by: {
              _id: "u214",
              fullname: "Emily Harris",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/User-26787824/original/362eb154-2928-4d8d-acc3-92f9a1fcd1ab.jpeg?im_w=240",
            },
          },
          {
            id: "r208",
            txt: "The villa is incredible, offering privacy and luxury. Highly recommend the private beach access!",
            rate: 4,
            by: {
              _id: "u215",
              fullname: "Michael Brown",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/87b83be7-edfc-4753-aa2a-89673e8d5f74.jpg?im_w=240",
            },
          },
          {
            id: "r209",
            txt: "The best vacation experience! The staff were attentive and the amenities top-notch.",
            rate: 5,
            by: {
              _id: "u216",
              fullname: "Linda Johnson",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/933b5037-d93b-4e1c-af0a-f81ba7fdff71.jpg?im_w=240",
            },
          },
          {
            id: "r210",
            txt: "Exquisite Thai cuisine from the in-house chef, and the spa treatments were heavenly.",
            rate: 5,
            by: {
              _id: "u217",
              fullname: "Robert Smith",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/e105ca81-b60f-47ff-9944-9166beca8ba2.jpg?im_w=240",
            },
          },
          {
            id: "r211",
            txt: "Perfect for our honeymoon! Romantic setting, beautiful sunsets, and unforgettable experiences.",
            rate: 5,
            by: {
              _id: "u218",
              fullname: "Sophia Wilson",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/92cafe09-9d5a-4971-9985-48002f0c35ae.jpg?im_w=240",
            },
          },
        ],
        likedByUsers: ["beach-lover", "luxury-traveler"],
      },
      {
        _id: "s103",
        name: "Urban Central Studio",
        type: "Apartment",
        imgUrls: [
          "https://a0.muscache.com/im/pictures/9d11ec4c-664e-4ef6-9461-ae55ff16bfc8.jpg?im_w=720",
          "https://a0.muscache.com/im/pictures/6978a9e8-4f78-4c50-ae71-48b44083e56c.jpg?im_w=480",
          // ... more image URLs
        ],
        price: 95.0,
        summary:
          "Cozy studio apartment in the city center with modern amenities.",
        capacity: 4,
        amenities: ["Grand pianos", "Trending", "Towers", "OMG", "Beachfront", "Historial homes"],
        labels: ["City Life", "Business", "Comfort"],
        host: {
          _id: "u103",
          fullname: "Anna Smith",
          imgUrl: "https://example.com/host2.jpg",
        },
        loc: {
          area: "North America",
          country: "USA",
          countryCode: "US",
          city: "New York",
          address: "500 5th Ave",
          lat: 40.7128,
          lng: -74.006,
        },
        reviews: [
          {
            id: "r102",
            txt: "Great location and fantastic city view!",
            rate: 5,
            by: {
              _id: "u104",
              fullname: "user3",
              imgUrl: "/img/img3.jpg",
            },
          },
        ],
        likedByUsers: ["user4", "user5"],
      },
      {
        _id: "s106",
        name: "Mountain Retreat Lodge",
        type: "Lodge",
        imgUrls: [
          "https://a0.muscache.com/im/pictures/e287757a-389d-424b-8863-4651b9303a49.jpg?im_w=960",
          "https://a0.muscache.com/im/pictures/8ccefdd3-d255-48b1-adab-9ffc78f588ce.jpg?im_w=480",
          // ... more image URLs
        ],
        price: 130.0,
        summary:
          "Cozy mountain lodge in the heart of the Rockies, perfect for adventure seekers.",
        capacity: 5,
        amenities: ["Mansions", "Amazing pools", "Luxe", "Earth homes", "Skiling", "Rooms"],
        labels: ["Mountain Adventure", "Rustic", "Nature Lover's Paradise"],
        host: {
          _id: "u107",
          fullname: "Emily Johnson",
          imgUrl: "https://example.com/host4.jpg",
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
            id: "r201",
            txt: "Absolutely stunning views and incredibly cozy rooms.",
            rate: 5,
            by: {
              _id: "u201",
              fullname: "user10",
              imgUrl: "/img/img10.jpg",
            },
          },
          {
            id: "r202",
            txt: "The host was very welcoming and provided great local tips.",
            rate: 4,
            by: {
              _id: "u202",
              fullname: "user11",
              imgUrl: "/img/img11.jpg",
            },
          },
          {
            id: "r203",
            txt: "An ideal place for relaxation, surrounded by nature.",
            rate: 5,
            by: {
              _id: "u203",
              fullname: "user12",
              imgUrl: "/img/img12.jpg",
            },
          },
          {
            id: "r204",
            txt: "Loved the modern amenities mixed with a rustic charm.",
            rate: 4,
            by: {
              _id: "u204",
              fullname: "user13",
              imgUrl: "/img/img13.jpg",
            },
          },
          {
            id: "r205",
            txt: "A serene retreat - peaceful, quiet, and beautiful.",
            rate: 5,
            by: {
              _id: "u205",
              fullname: "user14",
              imgUrl: "/img/img14.jpg",
            },
          },
        ],

        likedByUsers: ["user10", "user11"],
      },
      {
        _id: "s108",
        name: "Urban Modern Loft",
        type: "Apartment",
        imgUrls: [
          "https://a0.muscache.com/im/pictures/hosting/Hosting-892868455054207876/original/dcf4d485-2e1d-4747-b345-f6a0d008a195.jpeg?im_w=1200",
          "https://a0.muscache.com/im/pictures/hosting/Hosting-892868455054207876/original/9a1f4029-476c-48c0-9c34-5452ebe20480.jpeg?im_w=720",
          "https://a0.muscache.com/im/pictures/hosting/Hosting-892868455054207876/original/3812c387-bc86-4219-9b07-84a5fa9c32b3.jpeg?im_w=1200",
          "https://a0.muscache.com/im/pictures/hosting/Hosting-892868455054207876/original/10002cdd-6bbf-454b-9818-599241ac6e99.jpeg?im_w=720",
          "https://a0.muscache.com/im/pictures/hosting/Hosting-892868455054207876/original/77c18d04-513e-4537-9dbd-80ebedfee6ca.jpeg?im_w=720",
        ],
        price: 95.0,
        summary: "Stylish, modern apartment in the city center...",
        capacity: 4,
        amenities: ["Breakfasts", "Riads", "Trending", "Iconic cities", "Arctic", "Play"],
        labels: ["City View", "New", "Luxury"],
        host: {
          _id: "u103",
          fullname: "Alex Johnson",
          imgUrl:
            "https://a0.muscache.com/im/pictures/user/001c1a3b-2596-4308-956a-7b410e6e8605.jpg?im_w=240",
        },
        loc: {
          area: "North America",
          country: "United States",
          countryCode: "US",
          city: "New York",
          address: "123 Liberty St",
          lat: -74.00597,
          lng: 40.7128,
        },
        reviews: [
          {
            id: "r101",
            txt: "Great place in a perfect location...",
            rate: 5,
            by: {
              _id: "u104",
              fullname: "Morgan Blake",
              imgUrl: "/img/morgan.jpg",
            },
          },
        ],
        likedByUsers: ["city-explorer"],
      },
      {
        _id: "s109",
        name: "Ribeira Charming Duplex",
        type: "Arctic",
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
        amenities: ["Luxe", "Top of the world", "Amazing views", "Riads", "Trending", "Beachfront"],
        labels: ["Top of the world", "Trending", "Play", "Tropical"],
        host: {
          _id: "u101",
          fullname: "Davit Pok",
          imgUrl:
            "https://a0.muscache.com/im/pictures/fab79f25-2e10-4f0f-9711-663cb69dc7d8.jpg?aki_policy=profile_small",
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
        _id: "s110",
        name: "Countryside Retreat Cabin",
        type: "Cabin",
        imgUrls: [
          "https://a0.muscache.com/im/pictures/miso/Hosting-53768213/original/cb94df28-bb71-4052-abc8-426d79dba45c.jpeg?im_w=1200",
          "https://a0.muscache.com/im/pictures/miso/Hosting-53768213/original/5ebf5cce-0caf-4822-ba0b-6cb4302e56db.jpeg?im_w=1200",
          "https://a0.muscache.com/im/pictures/miso/Hosting-53768213/original/aad94f1a-966a-46eb-8069-15802c65e717.jpeg?im_w=1200",
          "https://a0.muscache.com/im/pictures/miso/Hosting-53768213/original/6b2843bb-b1c1-4925-b19c-8548638714fa.jpeg?im_w=1200",
          "https://a0.muscache.com/im/pictures/miso/Hosting-53768213/original/85980c60-c503-402e-bec4-9ee312249db8.jpeg?im_w=720",
        ],
        price: 75.0,
        summary: "Cozy cabin in the woods, perfect for a peaceful getaway...",
        capacity: 2,
        amenities: [
          "Fireplace",
          "Wifi",
          "Forest view",
          "Kitchen",
          "Hiking trails nearby",
          "Pet friendly",
        ],
        labels: ["Cozy", "Rustic", "Nature"],
        host: {
          _id: "u107",
          fullname: "Emily Turner",
          imgUrl:
            "https://a0.muscache.com/im/pictures/user/813a53c8-b08f-44e1-8c16-21001b65ac6c.jpg?im_w=240",
        },
        loc: {
          area: "Europe",
          country: "Norway",
          countryCode: "NO",
          city: "Bergen",
          address: "50 Forest Road",
          lat: 60.3913,
          lng: 5.3221,
        },
        reviews: [
          {
            id: "r103",
            txt: "A beautiful cabin surrounded by nature, very relaxing...",
            rate: 5,
            by: {
              _id: "u108",
              fullname: "Liam Smith",
              imgUrl: "/img/liam.jpg",
            },
          },
        ],
        likedByUsers: ["nature-enthusiast"],
      },
      {
        _id: "s102",
        name: "Ribeira Charming Duplex",
        type: "House",
        imgUrls: [
          "https://a0.muscache.com/im/pictures/103406579/d70068da_original.jpg?im_w=720",
          "https://a0.muscache.com/im/pictures/83cd682a-4ffe-4ed0-a4b2-3f3b0c14d1b2.jpg?im_w=480",
        ],
        price: 80.0,
        summary: "Fantastic duplex apartment...",
        capacity: 8,
        amenities: ["Amazing views", "Iconic cities", "Creative spaces", "Towers", "OMG", "Beachfront"],
        labels: ["Top of the world", "Trending", "Play", "Tropical"],
        host: {
          _id: "u101",
          fullname: "Davit Pok",
          imgUrl:
            "https://a0.muscache.com/im/pictures/fab79f25-2e10-4f0f-9711-663cb69dc7d8.jpg?aki_policy=profile_small",
        },
        loc: {
          area: "Asia",
          country: "China",
          countryCode: "CN",
          city: "Beijing",
          address: "30 Fui st",
          lat: 39.858139,
          lng: 116.356046,
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
    ];

    utilService.saveToStorage(STORAGE_KEY, stays);
  }
}
