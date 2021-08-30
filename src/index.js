import store from "./store"

import * as actions from "./actions"

const unsubscribe = store.subscribe(() => {
    console.log("Store changed", store.getState())
})

store.dispatch(actions.bugAdded({ description: "bug 1" }))

store.dispatch(actions.bugResolved({ id: 0 }))

store.dispatch(actions.bugRemoved({ id: 0 }))
