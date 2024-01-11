import { stayService } from "../services/stay.service";

export const SET_STAYS = "SET_STAYS";
export const REMOVE_STAY = "REMOVE_STAY";
export const ADD_STAY = "ADD_STAY";
export const UPDATE_STAY = "UPDATE_STAY";
export const ADD_TO_CART = "ADD_TO_CART";
export const CLEAR_CART = "CLEAR_CART";
export const UNDO_REMOVE_STAY = "UNDO_REMOVE_STAY";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";
export const SET_IS_LOADING = "SET_IS_LOADING";
export const SET_SELECTED_DATES = "SET_SELECTED_DATES";
export const SET_GUESTS_NUMBER = "SET_GUESTS_NUMBER";
export const SET_FILTER_BY = "SET_FILTER_BY";

const initialState = {
  stays: [],
  cart: [],
  lastRemovedStay: null,
  isLoading: false,
  selectedDates: { checkIn: null, checkOut: null },
  selectedGuests: { Adults: 0, Children: 0, Infants: 0, Pets: 0 },
  filterBy: stayService.getDefaultFilter(),
  // selectedPriceRange: [0, 2000]
  filters: [
    {
      Arctic:
        "https://a0.muscache.com/pictures/8b44f770-7156-4c7b-b4d3-d92549c8652f.jpg",
      "Iconic cities":
        "https://a0.muscache.com/pictures/ed8b9e47-609b-44c2-9768-33e6a22eccb2.jpg",
      Beachfront:
        "https://a0.muscache.com/pictures/bcd1adc0-5cee-4d7a-85ec-f6730b0f8d0c.jpg",
      Trending:
        "https://a0.muscache.com/pictures/3726d94b-534a-42b8-bca0-a0304d912260.jpg",
      Rooms:
        "https://a0.muscache.com/pictures/7630c83f-96a8-4232-9a10-0398661e2e6f.jpg",
      Play: "https://a0.muscache.com/pictures/f0c5ca0f-5aa0-4fe5-b38d-654264bacddf.jpg",
      "Chef kitchens":
        "https://a0.muscache.com/pictures/ddd13204-a5ae-4532-898c-2e595b1bb15f.jpg",
      "Amazing pools":
        "https://a0.muscache.com/pictures/3fb523a0-b622-4368-8142-b5e03df7549b.jpg",
      Breakfasts:
        "https://a0.muscache.com/pictures/5ed8f7c7-2e1f-43a8-9a39-4edfc81a3325.jpg",
      Riads:
        "https://a0.muscache.com/pictures/7ff6e4a1-51b4-4671-bc9a-6f523f196c61.jpg",
      Luxe: "https://a0.muscache.com/pictures/c8e2ed05-c666-47b6-99fc-4cb6edcde6b4.jpg",
      "Grand pianos":
        "https://a0.muscache.com/pictures/8eccb972-4bd6-43c5-ac83-27822c0d3dcd.jpg",
      "Historial homes":
        "https://a0.muscache.com/pictures/33dd714a-7b4a-4654-aaf0-f58ea887a688.jpg",
      Mansions:
        "https://a0.muscache.com/pictures/78ba8486-6ba6-4a43-a56d-f556189193da.jpg",
      Towers:
        "https://a0.muscache.com/pictures/d721318f-4752-417d-b4fa-77da3cbc3269.jpg",
      "Creative spaces":
        "https://a0.muscache.com/pictures/8a43b8c6-7eb4-421c-b3a9-1bd9fcb26622.jpg",
      "Top of the world":
        "https://a0.muscache.com/pictures/248f85bf-e35e-4dc3-a9a1-e1dbff9a3db4.jpg",
      Skiling:
        "https://a0.muscache.com/pictures/c8bba3ed-34c0-464a-8e6e-27574d20e4d2.jpg",
      "Earth homes":
        "https://a0.muscache.com/pictures/d7445031-62c4-46d0-91c3-4f29f9790f7a.jpg",
      "Amazing views":
        "https://a0.muscache.com/pictures/3b1eb541-46d9-4bef-abc4-c37d77e3c21b.jpg",
      OMG: "https://a0.muscache.com/pictures/c5a4f6fc-c92c-4ae8-87dd-57f1ff1b89a6.jpg",
    },
  ],
  types:[{
   
  }]
}

export function stayReducer(state = initialState, action) {
  var newState = state;
  var stays;
  var cart;
  switch (action.type) {
    case SET_STAYS:
      newState = { ...state, stays: action.stays };
      break;
    case REMOVE_STAY:
      const lastRemovedstay = state.stays.find(
        (stay) => stay._id === action.stayId
      );
      stays = state.stays.filter((stay) => stay._id !== action.stayId);
      newState = { ...state, stays, lastRemovedstay };
      break;
    case ADD_STAY:
      newState = { ...state, stays: [...state.stays, action.stay] };
      break;
    case UPDATE_STAY:
      stays = state.stays.map((stay) =>
        stay._id === action.stay._id ? action.stay : stay
      );
      newState = { ...state, stays };
      break;
    case ADD_TO_CART:
      newState = { ...state, cart: [...state.cart, action.stay] };
      break;
    case REMOVE_FROM_CART:
      cart = state.cart.filter((stay) => stay._id !== action.stayId);
      newState = { ...state, cart };
      break;
    case CLEAR_CART:
      newState = { ...state, cart: [] };
      break;
    case SET_IS_LOADING:
      return { ...state, isLoading: action.isLoading };
    case SET_SELECTED_DATES:
      return { ...state, selectedDates: action.selectedDates };
    case SET_GUESTS_NUMBER:
      return { ...state, selectedGuests: action.selectedGuests };
    case UNDO_REMOVE_STAY:
      if (state.lastRemovedStay) {
        newState = {
          ...state,
          stays: [...state.stays, state.lastRemovedStay],
          lastRemovedStay: null,
        };
      }
    case SET_FILTER_BY:
      return { ...state, filterBy: { ...state.filterBy, ...action.filterBy } };
      break;
    default:
  }
  return newState;
}
