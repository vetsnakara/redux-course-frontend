import { createStore } from "redux"
import { devToolsEnhancer } from "redux-devtools-extension"

import { reducer } from "./reducer"
import * as actions from "./actions"

const store = createStore(reducer, devToolsEnhancer({ trace: true }))

store.subscribe(() => console.log(store.getState()))

store.dispatch(actions.bugAdded({ description: "Bug 1" }))
store.dispatch(actions.bugAdded({ description: "Bug 2" }))
store.dispatch(actions.bugAdded({ description: "Bug 3" }))
store.dispatch(actions.bugResolved({ id: 0 }))
