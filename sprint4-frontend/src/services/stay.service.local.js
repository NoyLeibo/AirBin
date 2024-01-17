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

async function query(filterBy = getDefaultFilter()) {
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
      return stay.bedrooms >= filterBy.bedrooms;
    });
  }
  if (filterBy.beds) {
    stays = stays.filter((stay) => {
      return stay.beds >= filterBy.beds;
    });
  }
  if (filterBy.bathrooms) {
    stays = stays.filter((stay) => {
      console.log(stay.baths, " >= ", filterBy.bathrooms);
      return stay.baths >= filterBy.bathrooms;
    });
  }
  if (filterBy.placeType.length) {
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
    roomType: "",
    capacity: 0,
    beds: 0,
    rooms: 0,
    bathrooms: 0,
    amenities: [],
    labels: [],
    host: {
      _id: "",
      fullname: "",
      imgUrl: "",
      hostingYears: 0,
      ownerReview: "",
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
        "name": "City Loft",
        "type": "Loft",
        "imgUrls": [
          "https://a0.muscache.com/im/pictures/miso/Hosting-813949239894880001/original/b2abe806-b60f-4c0b-b4e6-46808024e5b6.jpeg?im_w=1200",
          "https://a0.muscache.com/im/pictures/miso/Hosting-813949239894880001/original/f69d24ed-c089-4a43-ba1d-fb98cba37afd.jpeg?im_w=1200",
          "https://a0.muscache.com/im/pictures/miso/Hosting-813949239894880001/original/c4031456-dc24-4683-ba84-6cdac0c2cb65.jpeg?im_w=1200",
          "https://a0.muscache.com/im/pictures/miso/Hosting-813949239894880001/original/04aacd17-ad9c-4f70-8bf3-24e573508d39.jpeg?im_w=720",
          "https://a0.muscache.com/im/pictures/miso/Hosting-813949239894880001/original/e0ed8801-5276-49f2-80e3-b6537681ecf8.jpeg?im_w=1200",
          "https://a0.muscache.com/im/pictures/miso/Hosting-813949239894880001/original/6dd08b81-7b42-42f5-8aee-4d26edd482bd.jpeg?im_w=720",
          "https://a0.muscache.com/im/pictures/miso/Hosting-813949239894880001/original/c1e73adc-959e-44e4-ab1d-86892824d262.jpeg?im_w=720",
          "https://a0.muscache.com/im/pictures/miso/Hosting-813949239894880001/original/69da724d-683d-427b-839d-9d95b67a8dcf.jpeg?im_w=720",
          "https://a0.muscache.com/im/pictures/miso/Hosting-813949239894880001/original/86ea0910-9c6b-4387-b412-f0ccc5285760.jpeg?im_w=720"
        ],
        "price": 1980.0,
        "bedrooms": 1,
        "beds": 2,
        "bathrooms": 1,
        "summary": "A modern loft located in the bustling city center.",
        "capacity": 2,
        "amenities": [
          "Iconic cities",
          "Top of the world",
          "Trending",
          "Play",
          "Amazing views",
          "Luxe"
        ],
        "labels": ["Urban", "Modern", "City"],
        "host": {
          "fullname": "Sophia Turner",
          "thumbnailUrl": "https://a0.muscache.com/im/pictures/user/21446f54-4214-40f4-813b-6d6c0113d7f3.jpg?im_w=240",
          "hostingYears": 3,
          "about": "The Treeframe is a modern a-frame treehouse that offers an unforgettable short-term rental experience. Located in the heart of the forest and surrounded by nature, our treehouse is the perfect spot for travelers looking for a one-of-a-kind getaway. Our treehouse is fully equipped with all the amenities you need for a relaxing stay, and Nick is always available to answer any questions you may have. Come discover the beauty of nature and escape the hustle and bustle of city life at The Treeframe!"
        },
        "loc": {
          "country": "UK",
          "countryCode": "GB",
          "city": "London",
          "address": "1111 Urban St, London",
          "lat": 51.5074,
          "lan": -0.1278
        },
        "reviews": [
          {
            "txt": "This was one of the best rentals I’ve ever had. We used it as a recovery retreat and will definitely be back for a fun time. 10/10 would recommend",
            "rate": 4,
            "by": {
              "fullname": "Roi-bnb",
              "imgUrl":
                "https://a0.muscache.com/im/pictures/user/0874f182-cdb8-4093-825b-770631235773.jpg?im_w=240",
            },
          },
          {
            "txt": "We recently hosted an Administrative retreat at the Windsor Mansion Inn and the experience was beyond anything we expected. Andy was so kind and accommodating. He even surprised us with warm chocolate chip cookies during our meeting! I would absolutely recommend a visit to the Inn, whether its for a relaxing evening away, or to host an event overlooking the beautiful mountains. You will not be disappointed with Andy and his team!",
            "rate": 5,
            "by": {
              "fullname": "Martin",
              "imgUrl":
                "https://a0.muscache.com/im/pictures/user/1e793581-0ed6-4c96-9d2b-5ceabb948075.jpg?im_w=240",
            },
          },
          {
            "txt": "I enjoyed my vacation, great view, good parking place, very silent, relaxed from city noise, become friend with very fat cat, definitely will come back",
            "rate": 4,
            "by": {
              "fullname": "Demet",
              "imgUrl":
                "https://a0.muscache.com/im/pictures/user/f7deaebe-6e45-4a7a-844c-b562fb8ba1a1.jpg?im_w=240",
            },
          },
          {
            "txt": "Our stay was great! The host was super friendly and highly responsive. And he made us a delicious breakfast. The only minor issue was some repair work next to the villa, but it didn't really bother us. Overall, it was a wonderful experience, and we'd consider coming back.",
            "rate": 5,
            "by": {
              "fullname": "James Carter",
              "imgUrl":
                "https://a0.muscache.com/im/users/23331610/profile_pic/1415110296/original.jpg?im_w=240",
            },
          },
          {
            "txt": "Ridvan was an amazing host, was very helpful and friendly. Place had an amazing view and very clean.",
            "rate": 5,
            "by": {
              "fullname": "Emily Harris",
              "imgUrl":
                "https://a0.muscache.com/im/pictures/user/User-26787824/original/362eb154-2928-4d8d-acc3-92f9a1fcd1ab.jpeg?im_w=240",
            },
          },
          {
            "txt": "The villa is incredible, offering privacy and luxury. Highly recommend the private beach access!",
            "rate": 4,
            "by": {
              "_id": "u215",
              "fullname": "Michael Brown",
              "imgUrl":
                "https://a0.muscache.com/im/pictures/user/87b83be7-edfc-4753-aa2a-89673e8d5f74.jpg?im_w=240",
            },
          },
        ],
        "likedByUsers": ["city-explorer", "business-traveler"],
        "rate": "5.0"
      },
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
          "https://a0.muscache.com/im/pictures/98274276/1cdeef84_original.jpg?im_w=1200",
        ],
        price: 1200.0,
        bedrooms: 4, // added
        beds: 7, // added
        baths: 3, // added
        summary: "Beautiful villa with direct access to the beach...",
        capacity: 6,
        amenities: [
          "Breakfasts",
          "Top of the world",
          "Mansions",
          "Rooms",
          "Historial homes",
          "Chef kitchens",
        ],
        labels: ["Beach", "Family", "Sunset View"],
        host: {
          _id: "u105",
          fullname: "Maria Gonzalez",
          imgUrl:
            "https://a0.muscache.com/im/pictures/user/d7f7361f-9b5d-4780-a3cf-029a10bdcc1e.jpg?im_w=240",
          hostingYears: 3, // added
          ownerReview: `Amazing luxury apartment, located in a new residential project with luxurious lobby and 24/7 security.
          The apartment overlooks the sea and the entire city of Tel Aviv from it's extra large and shaded balcony on the 27th floor.
          There are 2 spacious bedrooms, closets, full size tub, pampering living room wits smart TV, fully equipped kitchen: dishwasher, a Nespresso machine, dining area, AC, washing machine, dryer & more!`, // added
        }, // added
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
            id: "madeId2",
            txt: "Fantastic location, close to the city center. The room was clean...",
            rate: 5,
            by: {
              _id: "u103",
              fullname: "bigboss3",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/96db5a52-52db-42d4-a8bf-fe4d9cb7901d.jpg?im_w=240",
            },
          },
          {
            id: "madeId3",
            txt: "Charming apartment with amazing views. Hosts were very accommodating...",
            rate: 5,
            by: {
              _id: "u104",
              fullname: "Matthew Andreh",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/7e30997b-191c-4f49-bd71-ea57e4fe8d91.jpg?im_w=240",
            },
          },
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
        _id: "s105",
        name: "Luxury hotel",
        type: "House",
        imgUrls: [
          "https://a0.muscache.com/im/pictures/prohost-api/Hosting-813098446617682255/original/4fd02531-0a0f-46b9-b6f1-6b98f183ef80.jpeg?im_w=1200",
          "https://a0.muscache.com/im/pictures/prohost-api/Hosting-813098446617682255/original/349b74c1-c1d5-473f-b793-98df1c97c914.png?im_w=1200",
          "https://a0.muscache.com/im/pictures/prohost-api/Hosting-813098446617682255/original/b5e8c42c-392e-4ace-b2f9-863239db73af.png?im_w=720",
          "https://a0.muscache.com/im/pictures/prohost-api/Hosting-813098446617682255/original/234e6908-2fcd-44fb-af5c-7d3ceb77d740.png?im_w=720",
          "https://a0.muscache.com/im/pictures/prohost-api/Hosting-813098446617682255/original/df776b30-5d03-4c08-8df1-1ae0aa77dbb0.png?im_w=720",
          "https://a0.muscache.com/im/pictures/prohost-api/Hosting-813098446617682255/original/c9459814-5fda-4fb4-872d-3f6ed497682a.png?im_w=1200",
          "https://a0.muscache.com/im/pictures/prohost-api/Hosting-813098446617682255/original/0f3af96b-4ec3-40f5-affb-9def711889d2.png?im_w=1200",
        ],
        price: 200.0,
        bedrooms: 3,
        beds: 4,
        baths: 2,
        summary:
          "Experience the charm of the countryside in our rustic farmhouse.",
        capacity: 6,
        amenities: [
          "Breakfasts",
          "Creative spaces",
          "Rooms",
          "Amazing pools",
          "Play",
          "Earth homes",
        ],
        labels: ["Country", "Rustic", "Farm"],
        host: {
          _id: "u109",
          fullname: "John Doe",
          imgUrl:
            "https://a0.muscache.com/im/pictures/user/5ba88c88-0544-4d2e-9e61-fa1677688e6d.jpg?im_w=240",
          hostingYears: 2,
          ownerReview: `Welcome to The Treeframe, a one-of-a-kind stay like no other. Our short term rental is 13 feet off the ground, with luxury amenities including a hot tub, heated floors in the bathroom, a cozy king bed loft, and a fireplace. You will enjoy deep breaths while taking in the stunning river, mountain, and forest views from the giant custom triangular a-frame windows.

          This unique property has been featured on A&E's "Living Smaller" tv show and has gone viral on IG and TikTok. Come and experience The Treeframe for yourself and see why it's one of the most sought after stays in the country.`,
        },
        loc: {
          area: "Countryside",
          country: "France",
          countryCode: "FR",
          city: "Provence",
          address: "1010 Country Lane, Provence",
          lat: 43.9352,
          lng: 5.051,
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
            id: "madeId",
            txt: "Very helpful hosts. Cooked traditional...",
            rate: 4,
            by: {
              _id: "u102",
              fullname: "Andreh",
              imgUrl:
                "https://a0.muscache.com/im/users/4430456/profile_pic/1355792528/original.jpg?im_w=240",
            },
          },
          {
            id: "madeId8",
            txt: "Exceptional stay! The host went above and beyond to ensure our comfort...",
            rate: 5,
            by: {
              _id: "u109",
              fullname: "Alyssa",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/User-443687748/original/f046f60e-6986-4b2a-a32b-db8077edad50.jpeg?im_w=240",
            },
          },
          {
            id: "r103",
            txt: "A beautiful cabin surrounded by nature, very relaxing...",
            rate: 5,
            by: {
              _id: "u108",
              fullname: "Liam Smith",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/219c0432-1765-43cc-bdb6-3d12087cafa9.jpg?im_w=240",
            },
          },
          {
            id: "r201",
            txt: "Absolutely stunning views and incredibly cozy rooms.",
            rate: 5,
            by: {
              _id: "u201",
              fullname: "Kayleigh0",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/97e7f03e-0b22-484d-864b-ea99aeb092fa.jpg?im_w=240",
            },
          },
          {
            id: "r202",
            txt: "The host was very welcoming and provided great local tips.",
            rate: 4,
            by: {
              _id: "u202",
              fullname: "Dannielle1",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/0874f182-cdb8-4093-825b-770631235773.jpg?im_w=240",
            },
          },
          {
            id: "r203",
            txt: "An ideal place for relaxation, surrounded by nature.",
            rate: 5,
            by: {
              _id: "u203",
              fullname: "Jennifer2",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/7c44e5cf-7dac-46fb-80a1-da1f91a04533.jpg?im_w=240",
            },
          },
          {
            id: "r204",
            txt: "Loved the modern amenities mixed with a rustic charm.",
            rate: 4,
            by: {
              _id: "u204",
              fullname: "Emily3",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/f7deaebe-6e45-4a7a-844c-b562fb8ba1a1.jpg?im_w=240",
            },
          },
        ],
        likedByUsers: ["wine-lover", "tranquility-seeker"],
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
          "https://a0.muscache.com/im/pictures/miso/Hosting-965149645977028534/original/d8ad988e-726d-412a-8d5a-5ce6bdfb80a1.jpeg?im_w=1200",
          "https://a0.muscache.com/im/pictures/miso/Hosting-965149645977028534/original/e98163f6-1b99-4ada-b2e1-710cd743d840.jpeg?im_w=720",
          "https://a0.muscache.com/im/pictures/miso/Hosting-965149645977028534/original/e63a0d1f-336c-4bbe-8e80-548cb7761198.jpeg?im_w=1200",
        ],
        price: 150.0,
        bedrooms: 2, // added
        beds: 10, // added
        baths: 2, //added
        summary:
          "Luxurious villa offering serene beachfront views and lush tropical gardens...",
        capacity: 6,
        amenities: [
          "Historial homes",
          "Play",
          "Creative spaces",
          "Beachfront",
          "Rooms",
          "Trending",
        ],
        labels: ["Luxury", "Beachfront", "Tropical Paradise"],
        host: {
          _id: "u111",
          fullname: "Achara Boonsri",
          imgUrl:
            "https://a0.muscache.com/im/pictures/user/010358d4-feff-433f-89d2-d3e8560d07a5.jpg?im_w=240",
          hostingYears: 3,
          ownerReview:
            "This stunning penthouse suite offers breathtaking city views. It's elegantly furnished, featuring a modern kitchen with high-end appliances, a cozy living room with a fireplace, and two serene bedrooms. The private rooftop terrace is perfect for evening relaxation.",
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
          {
            id: "madeId4",
            txt: "A cozy retreat in a great neighborhood. Loved the local coffee shops...",
            rate: 4,
            by: {
              _id: "u105",
              fullname: "Rebecca",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/1451c857-1d7b-4253-b9b3-76c2096026f2.jpg?im_w=240",
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
          "https://a0.muscache.com/im/pictures/miso/Hosting-806863249494914754/original/bb925365-25b6-4769-bfa9-d3a521e14579.jpeg?im_w=1200",
          "https://a0.muscache.com/im/pictures/miso/Hosting-806863249494914754/original/1abc4140-42bc-44b1-8c04-5799138de9da.jpeg?im_w=720",
          "https://a0.muscache.com/im/pictures/miso/Hosting-806863249494914754/original/5fa03abc-2064-4a8b-a1c4-f22cec314c17.jpeg?im_w=1200",
          "https://a0.muscache.com/im/pictures/miso/Hosting-806863249494914754/original/48481e2f-20d1-4935-b982-0ba2c12f2385.jpeg?im_w=720",
          "https://a0.muscache.com/im/pictures/miso/Hosting-806863249494914754/original/2c64b2ed-df22-44eb-9955-0504f6b38a2b.jpeg?im_w=720",
          "https://a0.muscache.com/im/pictures/miso/Hosting-806863249494914754/original/46b13b6d-39e3-49fe-ae0a-6f84cfcdd6eb.jpeg?im_w=720",
          "https://a0.muscache.com/im/pictures/miso/Hosting-806863249494914754/original/795bb83e-915b-4502-b9ec-d35f49e45273.jpeg?im_w=720",
        ],
        price: 95.0,
        bedrooms: 2, // added
        beds: 4, // added
        baths: 2, // added
        summary:
          "Cozy studio apartment in the city center with modern amenities.",
        capacity: 4,
        amenities: [
          "Grand pianos",
          "Trending",
          "Towers",
          "OMG",
          "Beachfront",
          "Historial homes",
          "Rooms",
          "Riads",
          "Amazing views",
        ],
        labels: ["City Life", "Business", "Comfort"],
        host: {
          _id: "u103",
          fullname: "Anna Smith",
          imgUrl:
            "https://a0.muscache.com/im/pictures/user/f59b960b-64c1-443b-99b8-44d5501f53be.jpg?im_w=240",
          hostingYears: 3, // added
          ownerReview:
            "Experience the charm of old-town living in our beautifully restored apartment. It features original hardwood floors, a gourmet kitchen, and a spacious living room with large windows. The bedrooms are quiet and comfortable, providing a peaceful night's sleep.",
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
              fullname: "boris",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/f793a59f-43cc-4a02-b8f0-eb5a542e68ff.jpg?im_w=240",
            },
          },
          {
            id: "madeId5",
            txt: "Perfect for a weekend getaway. The host was very responsive and helpful...",
            rate: 3,
            by: {
              _id: "u106",
              fullname: "nave",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/e6b632f2-03b5-4a26-a4eb-3b520d12a8e7.jpg?im_w=240",
            },
          },
          {
            id: "coll",
            txt: "Fantastic location, close to the city center. The room was clean...",
            rate: 5,
            by: {
              _id: "u103",
              fullname: "shoshi",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/96db5a52-52db-42d4-a8bf-fe4d9cb7901d.jpg?im_w=240",
            },
          },
          {
            id: "madeId3",
            txt: "Charming apartment with amazing views. Hosts were very accommodating...",
            rate: 5,
            by: {
              _id: "u104",
              fullname: "IMYOU",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/7e30997b-191c-4f49-bd71-ea57e4fe8d91.jpg?im_w=240",
            },
          },
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
            id: "madeId6",
            txt: "Quiet, clean, and comfortable. Great value for the price...",
            rate: 4,
            by: {
              _id: "u107",
              fullname: "Rebecca Yusang",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/User-169973182/original/f963066e-0a5f-48a4-8f96-ac6e62a035d3.jpeg?im_w=240",
            },
          },
          {
            id: "madeId7",
            txt: "Loved the modern design and amenities. The rooftop pool was a bonus...",
            rate: 5,
            by: {
              _id: "u108",
              fullname: "Rachael",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/ef5230a8-3dce-4115-8942-38f2a38a0ef7.jpg?im_w=240",
            },
          },
        ],
        likedByUsers: ["Matthew Andreh", "Rebecca"],
      },
      {
        _id: "s126",
        name: "Mountain Retreat Lodge",
        type: "Lodge",
        imgUrls: [
          "https://a0.muscache.com/im/pictures/prohost-api/Hosting-980616260826796990/original/0ebf9825-97ce-4aa4-8930-018bbfffb420.jpeg?im_w=1200",
          "https://a0.muscache.com/im/pictures/prohost-api/Hosting-980616260826796990/original/15f920e5-525b-4387-bfd7-7953615739d5.jpeg?im_w=720",
          "https://a0.muscache.com/im/pictures/prohost-api/Hosting-980616260826796990/original/20c7635a-3026-4deb-a8d0-41f33fd9b706.jpeg?im_w=720",
          "https://a0.muscache.com/im/pictures/prohost-api/Hosting-980616260826796990/original/03fcce74-d11f-4dbf-ac3d-a5ee6ba3d924.jpeg?im_w=720",
          "https://a0.muscache.com/im/pictures/prohost-api/Hosting-980616260826796990/original/f38c64dc-a950-4dea-88dc-8675e3292524.jpeg?im_w=720",
          "https://a0.muscache.com/im/pictures/prohost-api/Hosting-980616260826796990/original/3cff2b54-3ff8-49b6-a272-caef759927c0.jpeg?im_w=1200",
          "https://a0.muscache.com/im/pictures/prohost-api/Hosting-980616260826796990/original/03fcce74-d11f-4dbf-ac3d-a5ee6ba3d924.jpeg?im_w=1200",
        ],
        price: 130.0,
        bedrooms: 3, // added
        beds: 5, // added
        baths: 1, // added
        summary:
          "Cozy mountain lodge in the heart of the Rockies, perfect for adventure seekers.",
        capacity: 5,
        amenities: [
          "Mansions",
          "Amazing pools",
          "Luxe",
          "Earth homes",
          "Skiling",
          "Rooms",
        ],
        labels: ["Mountain Adventure", "Rustic", "Nature Lover's Paradise"],
        host: {
          _id: "u107",
          fullname: "Emily Johnson",
          imgUrl:
            "https://a0.muscache.com/im/users/27844976/profile_pic/1424111519/original.jpg?im_w=240",
          hostingYears: 3, // added
          ownerReview:
            "Nestled in the heart of the city, this contemporary apartment boasts an open-plan living space with stylish décor. The kitchen is a chef's dream, and the balcony offers a lovely view of the urban landscape. Each bedroom is equipped with luxurious bedding.", // added
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
              fullname: "Marissa0",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/97e7f03e-0b22-484d-864b-ea99aeb092fa.jpg?im_w=240",
            },
          },
          {
            id: "r202",
            txt: "The host was very welcoming and provided great local tips.",
            rate: 4,
            by: {
              _id: "u202",
              fullname: "Gabriel1231",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/0874f182-cdb8-4093-825b-770631235773.jpg?im_w=240",
            },
          },
          {
            id: "r203",
            txt: "An ideal place for relaxation, surrounded by nature.",
            rate: 5,
            by: {
              _id: "u203",
              fullname: "AC BnB2",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/7c44e5cf-7dac-46fb-80a1-da1f91a04533.jpg?im_w=240",
            },
          },
          {
            id: "r204",
            txt: "Loved the modern amenities mixed with a rustic charm.",
            rate: 4,
            by: {
              _id: "u204",
              fullname: "Bree3",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/f7deaebe-6e45-4a7a-844c-b562fb8ba1a1.jpg?im_w=240",
            },
          },
          {
            id: "r205",
            txt: "A serene retreat - peaceful, quiet, and beautiful.",
            rate: 5,
            by: {
              _id: "u205",
              fullname: "Michael4",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/316da211-0401-4d85-93a1-4a21bde0795c.jpg?im_w=240",
            },
          },
        ],

        likedByUsers: ["Nicole0", "Mollye1"],
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
        bedrooms: 2, // added
        beds: 4, // added
        baths: 1, // added
        amenities: [
          "Breakfasts",
          "Riads",
          "Trending",
          "Iconic cities",
          "Arctic",
          "Play",
        ],
        labels: ["City View", "New", "Luxury"],
        host: {
          _id: "u103",
          fullname: "Alex Johnson",
          imgUrl:
            "https://a0.muscache.com/im/pictures/user/001c1a3b-2596-4308-956a-7b410e6e8605.jpg?im_w=240",
          hostingYears: 3, // added
          ownerReview:
            "Immerse yourself in luxury at our high-rise apartment with panoramic city views. The living space is adorned with designer furniture and artwork. The bedrooms are spacious, and the kitchen is fitted with the latest appliances. It’s an urban oasis.",
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
              imgUrl:
                "https://a0.muscache.com/im/users/30112578/profile_pic/1427484476/original.jpg?im_w=240",
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
          "https://a0.muscache.com/im/pictures/4e1851cb-9614-4634-9dd4-016c1a26d259.jpg?im_w=1200",
          "https://a0.muscache.com/im/pictures/4309a61d-b60b-4dec-9b17-ffbe3252bd49.jpg?im_w=720",
          "https://a0.muscache.com/im/pictures/92a458c5-f684-4931-ab28-707848bb6e33.jpg?im_w=720",
          "https://a0.muscache.com/im/pictures/cc97f7ac-8a1f-430e-8d7d-39152e8d7b77.jpg?im_w=720",
          "https://a0.muscache.com/im/pictures/efa5c9f5-9b6a-404e-a0c9-09368824ea5e.jpg?im_w=720",
          "https://a0.muscache.com/im/pictures/c0c6f791-86da-4815-b789-9cc70ad1d440.jpg?im_w=720",
          "https://a0.muscache.com/im/pictures/cec69348-fb6c-4e61-bc2b-5dbc40dc2ae5.jpg?im_w=1200",
        ],
        price: 80.0,
        bedrooms: 4, // added
        beds: 7, // added
        baths: 3, // added
        summary: "Fantastic duplex apartment...",
        capacity: 8,
        amenities: [
          "Luxe",
          "Top of the world",
          "Amazing views",
          "Riads",
          "Trending",
          "Beachfront",
          "Trending",
          "Play",
        ],
        labels: ["Top of the world", "Trending", "Play", "Tropical"],
        host: {
          _id: "u101",
          fullname: "Davit Pok",
          imgUrl:
            "https://a0.muscache.com/im/users/30112578/profile_pic/1427484476/original.jpg?im_w=240",
          hostingYears: 3, // added
          ownerReview:
            "Immerse yourself in luxury at our high-rise apartment with panoramic city views. The living space is adorned with designer furniture and artwork. The bedrooms are spacious, and the kitchen is fitted with the latest appliances. It’s an urban oasis.",
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
              fullname: "Andreh",
              imgUrl:
                "https://a0.muscache.com/im/users/4430456/profile_pic/1355792528/original.jpg?im_w=240",
            },
          },
          {
            id: "madeId8",
            txt: "Exceptional stay! The host went above and beyond to ensure our comfort...",
            rate: 5,
            by: {
              _id: "u109",
              fullname: "Collin",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/User-443687748/original/f046f60e-6986-4b2a-a32b-db8077edad50.jpeg?im_w=240",
            },
          },
          {
            id: "madeId9",
            txt: "Great location for exploring the city. The apartment was spacious and well-equipped...",
            rate: 4,
            by: {
              _id: "u110",
              fullname: "Richard0",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/d0e4a04e-7020-4b10-ad37-9b5b1f4a62a9.jpg?im_w=240",
            },
          },
          {
            id: "madeId10",
            txt: "The garden was a peaceful retreat. Enjoyed the fresh morning pastries...",
            rate: 5,
            by: {
              _id: "u111",
              fullname: "Jake1",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/78319eb1-93a8-4d8a-8ad7-238e6a233baf.jpg?im_w=240",
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
        bedrooms: 2, // added
        beds: 2, // added
        baths: 2, // added
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
          hostingYears: 3, // added
          ownerReview:
            "Discover the perfect blend of comfort and elegance in our apartment. It features a spacious living room with a smart TV, a fully-equipped modern kitchen, and cozy bedrooms. The highlight is the private garden terrace, ideal for morning coffee.",
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
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/219c0432-1765-43cc-bdb6-3d12087cafa9.jpg?im_w=240",
            },
          },
          {
            id: "r201",
            txt: "Absolutely stunning views and incredibly cozy rooms.",
            rate: 5,
            by: {
              _id: "u201",
              fullname: "Yvette0",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/97e7f03e-0b22-484d-864b-ea99aeb092fa.jpg?im_w=240",
            },
          },
          {
            id: "r202",
            txt: "The host was very welcoming and provided great local tips.",
            rate: 4,
            by: {
              _id: "u202",
              fullname: "Andrew1",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/0874f182-cdb8-4093-825b-770631235773.jpg?im_w=240",
            },
          },
          {
            id: "r203",
            txt: "An ideal place for relaxation, surrounded by nature.",
            rate: 5,
            by: {
              _id: "u203",
              fullname: "Emily2",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/7c44e5cf-7dac-46fb-80a1-da1f91a04533.jpg?im_w=240",
            },
          },
          {
            id: "r204",
            txt: "Loved the modern amenities mixed with a rustic charm.",
            rate: 4,
            by: {
              _id: "u204",
              fullname: "ERudy3",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/f7deaebe-6e45-4a7a-844c-b562fb8ba1a1.jpg?im_w=240",
            },
          },
          {
            id: "r205",
            txt: "A serene retreat - peaceful, quiet, and beautiful.",
            rate: 5,
            by: {
              _id: "u205",
              fullname: "Hannah4",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/316da211-0401-4d85-93a1-4a21bde0795c.jpg?im_w=240",
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
          "https://a0.muscache.com/im/pictures/90bc0d78-c4f9-45e0-bd1a-43d5c5421a0a.jpg?im_w=720",
          "https://a0.muscache.com/im/pictures/d3b924c6-d127-4960-bf65-cbfc1822a953.jpg?`im_w=720",
          "https://a0.muscache.com/im/pictures/0140b41b-45da-49f3-a35f-41fa3983a22a.jpg?im_w=720",
          "https://a0.muscache.com/im/pictures/9ff5943f-a53c-4911-a02f-80c9da89f56e.jpg?im_w=1200",
          "https://a0.muscache.com/im/pictures/1cd00652-4ba5-48f7-afe3-89e15cbba4df.jpg?im_w=720",
          "https://a0.muscache.com/im/pictures/8e46bb44-0744-4b1f-bf9e-d54af68ed02a.jpg?im_w=1200",
          "https://a0.muscache.com/im/pictures/0e436c7f-fc11-4e6d-97ea-a11b1feb8f1c.jpg?im_w=720",
          "https://a0.muscache.com/im/pictures/98493977-8d2e-4ed2-8dae-168a139fe3f7.jpg?im_w=720",
        ],
        price: 80.0,
        summary: "Fantastic duplex apartment...",
        capacity: 8,
        bedrooms: 7, // added
        beds: 14, // added
        baths: 5, // added
        amenities: [
          "Amazing views",
          "Iconic cities",
          "Creative spaces",
          "Towers",
          "OMG",
          "Beachfront",
        ],
        labels: ["Top of the world", "Trending", "Play", "Tropical"],
        host: {
          _id: "u101",
          fullname: "Davit Pok",
          imgUrl:
            "https://a0.muscache.com/im/pictures/user/97e7f03e-0b22-484d-864b-ea99aeb092fa.jpg?im_w=240",
          hostingYears: 3, // added
          ownerReview:
            "Our apartment in the historic district offers a unique blend of classic charm and modern amenities. It includes a well-appointed kitchen, a comfortable living area, and bedrooms with antique furnishings. The location is perfect for exploring the city.",
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
              fullname: "Andreh",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/97e7f03e-0b22-484d-864b-ea99aeb092fa.jpg?im_w=240",
            },
          },
          {
            id: "r201",
            txt: "Absolutely stunning views and incredibly cozy rooms.",
            rate: 5,
            by: {
              _id: "u201",
              fullname: "Hannah0",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/97e7f03e-0b22-484d-864b-ea99aeb092fa.jpg?im_w=240",
            },
          },
          {
            id: "r202",
            txt: "The host was very welcoming and provided great local tips.",
            rate: 4,
            by: {
              _id: "u202",
              fullname: "Benjamin1",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/0874f182-cdb8-4093-825b-770631235773.jpg?im_w=240",
            },
          },
          {
            id: "r203",
            txt: "An ideal place for relaxation, surrounded by nature.",
            rate: 5,
            by: {
              _id: "u203",
              fullname: "Jared2",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/7c44e5cf-7dac-46fb-80a1-da1f91a04533.jpg?im_w=240",
            },
          },
          {
            id: "r204",
            txt: "Loved the modern amenities mixed with a rustic charm.",
            rate: 4,
            by: {
              _id: "u204",
              fullname: "Brittney3",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/f7deaebe-6e45-4a7a-844c-b562fb8ba1a1.jpg?im_w=240",
            },
          },
          {
            id: "r205",
            txt: "A serene retreat - peaceful, quiet, and beautiful.",
            rate: 5,
            by: {
              _id: "u205",
              fullname: "Brittney4",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/316da211-0401-4d85-93a1-4a21bde0795c.jpg?im_w=240",
            },
          },
        ],
        likedByUsers: ["mini-user"],
      },
      {
        _id: "s112",
        name: "Mountain Retreat",
        type: "Cabin",
        imgUrls: [
          "https://a0.muscache.com/im/pictures/799c603d-8867-40c3-a75e-d9450761d502.jpg?im_w=1200",
          "https://a0.muscache.com/im/pictures/0fbefb2d-566d-4106-8009-e8eef8804b5f.jpg?im_w=1200",
          "https://a0.muscache.com/im/pictures/633daf6f-eb69-4418-9d9b-950673806791.jpg?im_w=1200",
          "https://a0.muscache.com/im/pictures/e0db3e82-4452-4c47-a2cf-61d8c99d793e.jpg?im_w=720",
          "https://a0.muscache.com/im/pictures/8143b830-077c-48dd-8897-a44ea84c3a6f.jpg?im_w=1200",
          "https://a0.muscache.com/im/pictures/ea819af5-f575-491a-bf77-dbf4210afe5c.jpg?im_w=720",
          "https://a0.muscache.com/im/pictures/187b2b33-ca3e-4cc3-aabd-d0410cfa3a79.jpg?im_w=1200",
          "https://a0.muscache.com/im/pictures/101bee97-ac02-4570-b3fc-dab414adcf3d.jpg?im_w=1200",
        ],
        price: 850.0,
        bedrooms: 3,
        beds: 5,
        baths: 2,
        summary:
          "Cozy cabin in the mountains with stunning views and fresh air...",
        capacity: 8,
        amenities: [
          "Skiling",
          "Historial homes",
          "Creative spaces",
          "Arctic",
          "Amazing views",
          "Towers",
        ],
        labels: ["Mountain", "Adventure", "Nature"],
        host: {
          _id: "u106",
          fullname: "John Doe",
          imgUrl:
            "https://a0.muscache.com/im/pictures/user/User-38299422/original/2ab2d42c-80cb-46d8-bb26-232aacc1aef3.jpeg?im_w=240",
          hostingYears: 4,
          ownerReview: `This cabin offers the perfect escape from the city. Nestled in the mountains, it provides a serene environment for relaxation and adventure. Enjoy skiing nearby and come back to a cozy fireplace.`,
        },
        loc: {
          area: "Rocky Mountains",
          country: "USA",
          countryCode: "US",
          city: "Aspen",
          address: "456 Mountain View Rd",
          lat: 39.1911,
          lng: -106.8175,
        },
        reviews: [
          {
            id: "r201",
            txt: "Absolutely stunning views and incredibly cozy rooms.",
            rate: 5,
            by: {
              _id: "u201",
              fullname: "Zeeshan0",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/97e7f03e-0b22-484d-864b-ea99aeb092fa.jpg?im_w=240",
            },
          },
          {
            id: "r202",
            txt: "The host was very welcoming and provided great local tips.",
            rate: 4,
            by: {
              _id: "u202",
              fullname: "Lindsay1",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/0874f182-cdb8-4093-825b-770631235773.jpg?im_w=240",
            },
          },
          {
            id: "r203",
            txt: "An ideal place for relaxation, surrounded by nature.",
            rate: 5,
            by: {
              _id: "u203",
              fullname: "LChristina2",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/7c44e5cf-7dac-46fb-80a1-da1f91a04533.jpg?im_w=240",
            },
          },
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
        ],
        likedByUsers: ["nature-lover", "ski-enthusiast"],
      },
      {
        _id: "s113",
        name: "Urban Penthouse",
        type: "Apartment",
        imgUrls: [
          "https://a0.muscache.com/im/pictures/miso/Hosting-735631981787270205/original/6ba8675a-8cbf-4156-8951-51a4b1aa1171.jpeg?im_w=1200",
          "https://a0.muscache.com/im/pictures/miso/Hosting-735631981787270205/original/66f7bf0d-e750-4276-8868-3aedd5d203e8.jpeg?im_w=1200",
          "https://a0.muscache.com/im/pictures/miso/Hosting-735631981787270205/original/7948f5c4-c621-4cc5-8c56-0634402489db.jpeg?im_w=720",
          "https://a0.muscache.com/im/pictures/miso/Hosting-735631981787270205/original/c35dc16e-3bb9-4eed-9a84-df9d08eb7fa7.jpeg?im_w=720",
          "https://a0.muscache.com/im/pictures/miso/Hosting-735631981787270205/original/02b18587-113b-4745-bcb5-d97b1a6a18e3.jpeg?im_w=720",
          "https://a0.muscache.com/im/pictures/miso/Hosting-735631981787270205/original/2ca0decd-13dc-46f4-804a-e98b4fe32458.jpeg?im_w=1200",
          "https://a0.muscache.com/im/pictures/miso/Hosting-735631981787270205/original/80c172ce-99b6-4e0a-9b9a-d2e3c28b143b.jpeg?im_w=720",
          "https://a0.muscache.com/im/pictures/miso/Hosting-735631981787270205/original/c6d3545f-79c6-4d24-81a2-be5c03908723.jpeg?im_w=1200",
          "https://a0.muscache.com/im/pictures/miso/Hosting-735631981787270205/original/c50f0473-83ef-47f5-be6d-19aac1e9d2ba.jpeg?im_w=1200",
        ],
        price: 250.0,
        bedrooms: 3,
        beds: 5,
        baths: 2,
        summary:
          "A luxurious penthouse in the heart of the city with stunning skyline views.",
        capacity: 4,
        amenities: [
          "Arctic",
          "Iconic cities",
          "Beachfront",
          "Play",
          "Chef kitchens",
          "Amazing pools",
        ],
        labels: ["City Life", "Luxury", "Modern"],
        host: {
          _id: "u106",
          fullname: "Alice Johnson",
          imgUrl:
            "https://a0.muscache.com/im/pictures/user/289cdce3-a2cc-472f-b0a8-c5f0354fb914.jpg?im_w=240",
          hostingYears: 5,
          ownerReview:
            "Enjoy a lavish experience in our centrally located penthouse...",
        },
        loc: {
          area: "Downtown",
          country: "USA",
          countryCode: "US",
          city: "New York",
          address: "123 Main St, New York, NY",
          lat: 40.7128,
          lng: -74.006,
        },
        reviews: [
          {
            id: "r201",
            txt: "Absolutely stunning views and incredibly cozy rooms.",
            rate: 5,
            by: {
              _id: "u201",
              fullname: "LChristina0",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/97e7f03e-0b22-484d-864b-ea99aeb092fa.jpg?im_w=240",
            },
          },
          {
            id: "r202",
            txt: "The host was very welcoming and provided great local tips.",
            rate: 4,
            by: {
              _id: "u202",
              fullname: "LChristinaCorbin1",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/0874f182-cdb8-4093-825b-770631235773.jpg?im_w=240",
            },
          },
          {
            id: "r203",
            txt: "An ideal place for relaxation, surrounded by nature.",
            rate: 5,
            by: {
              _id: "u203",
              fullname: "Jonathan2",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/7c44e5cf-7dac-46fb-80a1-da1f91a04533.jpg?im_w=240",
            },
          },
          {
            id: "r204",
            txt: "Loved the modern amenities mixed with a rustic charm.",
            rate: 4,
            by: {
              _id: "u204",
              fullname: "JonJanet3",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/f7deaebe-6e45-4a7a-844c-b562fb8ba1a1.jpg?im_w=240",
            },
          },
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
        ],
        likedByUsers: ["city-explorer", "luxury-seeker"],
      },
      {
        _id: "s115",
        name: "Seaside Escape",
        type: "Villa",
        imgUrls: [
          "https://a0.muscache.com/im/pictures/miso/Hosting-904442199486043595/original/5647715b-f31c-4696-a868-e823fa21525f.jpeg?im_w=1200",
          "https://a0.muscache.com/im/pictures/miso/Hosting-904442199486043595/original/18c0241c-9ac2-41ed-913f-30bb06c2b95d.jpeg?im_w=720",
          "https://a0.muscache.com/im/pictures/miso/Hosting-904442199486043595/original/5567ca3f-c206-43cd-93d4-85ffe524cac5.jpeg?im_w=720",
          "https://a0.muscache.com/im/pictures/miso/Hosting-904442199486043595/original/da2b710a-3a80-47e6-945a-72b5d158ddea.jpeg?im_w=1200",
          "https://a0.muscache.com/im/pictures/miso/Hosting-904442199486043595/original/6ea1589e-bc46-4606-a888-beab811f742c.jpeg?im_w=720",
          "https://a0.muscache.com/im/pictures/miso/Hosting-904442199486043595/original/d6545fc9-9bb0-4e1e-a788-55dc2b928587.jpeg?im_w=720",
          "https://a0.muscache.com/im/pictures/miso/Hosting-904442199486043595/original/18c0241c-9ac2-41ed-913f-30bb06c2b95d.jpeg?im_w=1200",
        ],
        price: 350.0,
        bedrooms: 4,
        beds: 6,
        baths: 3,
        summary:
          "A beautiful villa by the sea, perfect for a relaxing getaway.",
        capacity: 6,
        amenities: [
          "Beachfront",
          "Amazing views",
          "Historial homes",
          "Luxe",
          "Grand pianos",
          "Trending",
        ],
        labels: ["Beach", "Family", "Relaxation"],
        host: {
          _id: "u107",
          fullname: "Carlos Mendez",
          imgUrl:
            "https://a0.muscache.com/im/pictures/user/5e26e89a-2af9-4de8-bb0d-2dafd7dbb7b8.jpg?im_w=240",
          hostingYears: 3,
          ownerReview:
            "This beachfront villa offers a serene and luxurious stay...",
        },
        loc: {
          area: "Seaside",
          country: "Spain",
          countryCode: "ES",
          city: "Barcelona",
          address: "456 Beach Ave, Barcelona",
          lat: 41.3851,
          lng: 2.1734,
        },
        reviews: [
          {
            id: "r201",
            txt: "Absolutely stunning views and incredibly cozy rooms.",
            rate: 5,
            by: {
              _id: "u201",
              fullname: "JonJanet0",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/97e7f03e-0b22-484d-864b-ea99aeb092fa.jpg?im_w=240",
            },
          },
          {
            id: "r202",
            txt: "The host was very welcoming and provided great local tips.",
            rate: 4,
            by: {
              _id: "u202",
              fullname: "JonJanetBen1",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/0874f182-cdb8-4093-825b-770631235773.jpg?im_w=240",
            },
          },
          {
            id: "r203",
            txt: "An ideal place for relaxation, surrounded by nature.",
            rate: 5,
            by: {
              _id: "u203",
              fullname: "Michelle2",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/7c44e5cf-7dac-46fb-80a1-da1f91a04533.jpg?im_w=240",
            },
          },
          {
            id: "r204",
            txt: "Loved the modern amenities mixed with a rustic charm.",
            rate: 4,
            by: {
              _id: "u204",
              fullname: "Ashleigh3",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/f7deaebe-6e45-4a7a-844c-b562fb8ba1a1.jpg?im_w=240",
            },
          },
          {
            id: "r205",
            txt: "A serene retreat - peaceful, quiet, and beautiful.",
            rate: 5,
            by: {
              _id: "u205",
              fullname: "Andreh4",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/316da211-0401-4d85-93a1-4a21bde0795c.jpg?im_w=240",
            },
          },
          {
            id: "r102",
            txt: "Great location and fantastic city view!",
            rate: 5,
            by: {
              _id: "u104",
              fullname: "boris",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/f793a59f-43cc-4a02-b8f0-eb5a542e68ff.jpg?im_w=240",
            },
          },
          {
            id: "madeId5",
            txt: "Perfect for a weekend getaway. The host was very responsive and helpful...",
            rate: 3,
            by: {
              _id: "u106",
              fullname: "nave",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/e6b632f2-03b5-4a26-a4eb-3b520d12a8e7.jpg?im_w=240",
            },
          },
          {
            id: "coll",
            txt: "Fantastic location, close to the city center. The room was clean...",
            rate: 5,
            by: {
              _id: "u103",
              fullname: "shoshi",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/96db5a52-52db-42d4-a8bf-fe4d9cb7901d.jpg?im_w=240",
            },
          },
          {
            id: "madeId3",
            txt: "Charming apartment with amazing views. Hosts were very accommodating...",
            rate: 5,
            by: {
              _id: "u104",
              fullname: "IMYOU",
              imgUrl:
                "https://a0.muscache.com/im/pictures/user/7e30997b-191c-4f49-bd71-ea57e4fe8d91.jpg?im_w=240",
            },
          },
        ],
        likedByUsers: ["beach-lover", "sun-seeker"],
      },
    ];

    utilService.saveToStorage(STORAGE_KEY, stays);
  }
}
