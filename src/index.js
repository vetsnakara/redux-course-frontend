import * as actions from "./store/projects"
import configureStore from "./store/configureStore"

const store = configureStore()

store.subscribe(() => console.log(store.getState()))

// store.dispatch(actions.bugAdded({ description: "Bug 1" }))
// store.dispatch(actions.bugAdded({ description: "Bug 2" }))
// store.dispatch(actions.bugAdded({ description: "Bug 3" }))
// store.dispatch(actions.bugResolved({ id: 0 }))
// store.dispatch(actions.bugRemoved({ id: 0 }))

store.dispatch(actions.projectAdded({ name: "project 1" }))
store.dispatch(actions.projectAdded({ name: "project 2" }))
store.dispatch(actions.projectAdded({ name: "project 3" }))
store.dispatch(actions.projectRemoved({ id: 0 }))
