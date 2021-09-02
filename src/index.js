import configureStore from "./store/configureStore"

import * as bugsActions from "./store/bugs"

const actions = {
    ...bugsActions,
}

const store = configureStore()

// UI layer
store.dispatch(actions.loadBugs())

store.dispatch(actions.resolveBug({id: 2}))

// store.dispatch(actions.addBug({ description: "x" }))

// setTimeout(() => {
//     store.dispatch(actions.resolveBug({ id: 2 }))
// }, 2000)
