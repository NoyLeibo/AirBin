import { MdOutlineIron } from "react-icons/md";
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
// export const SET_SELECTED_DATES = "SET_SELECTED_DATES";
// export const SET_GUESTS_NUMBER = "SET_GUESTS_NUMBER";
export const SET_FILTER_BY = "SET_FILTER_BY";

const initialState = {
  stays: [],
  cart: [],
  lastRemovedStay: null,
  isLoading: false,
  // selectedDates: { checkIn: null, checkOut: null },
  // selectedGuests: { Adults: 0, Children: 0, Infants: 0, Pets: 0 },
  filterBy: stayService.getDefaultFilter(),
  // selectedPriceRange: [0, 2000]
  filters: [
    'Iron',
    'Beach access',
    'Fire pit',
    'Pool',
    'Gym',
    'Air conditioning',
    'Washer',
    "Kitchen",
    'TV',
    'Wifi',
    'Heating',
    'Shampoo',
    'Essentials',
    'Hangers',
    'Internet',
    'Cable TV',
    'Elevator',
    'Doorman',
    'Self check-in',
    'Hot water',
    'Smoke detector',
    'BBQ gril',
    'Hot tub',
    'Piano',
    'Fire extinguisher',
    'First aid kit',
    'Outdoor shower',
    'Ski-in/Ski-out',
    'Beach access',
    'Lake access',

  ],
  types: [{

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
    case UNDO_REMOVE_STAY:
      if (state.lastRemovedStay) {
        newState = {
          ...state,
          stays: [...state.stays, state.lastRemovedStay],
          lastRemovedStay: null,
        };
      }
      break;

    case SET_FILTER_BY:
      return {
        ...state,
        filterBy: { ...state.filterBy, ...action.filterBy }
      };

    default:
      break;
  }
  return newState;
}
