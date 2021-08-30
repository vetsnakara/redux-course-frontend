import { createStore } from "./customStore"

import { reducer } from "./reducer"
import * as actions from "./actions"

const store = createStore(reducer)

store.subscribe(() => console.log(store.getState()))

store.dispatch(actions.bugAdded({ description: "Bug 1" }))

console.log(store.getState())
