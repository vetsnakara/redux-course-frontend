import * as actions from "./store/bugs"
import configureStore from "./store/configureStore"

const store = configureStore()

store.subscribe(() => console.log(store.getState()))

store.dispatch(actions.bugAdded({ description: "Bug 1" }))
store.dispatch(actions.bugAdded({ description: "Bug 2" }))
store.dispatch(actions.bugAdded({ description: "Bug 3" }))
store.dispatch(actions.bugResolved({ id: 0 }))
