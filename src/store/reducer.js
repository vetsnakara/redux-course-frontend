import { combineReducers } from "redux";

import entititesReducer from "./entities"

export default combineReducers({
  entities: entititesReducer
})