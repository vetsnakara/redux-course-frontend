import configureStore from "./store/configureStore"

import * as projectsActions from "./store/projects"
import * as bugsActions from "./store/bugs"
import * as usersActions from "./store/users"
import * as apiActions from "./store/api"

import { getBugsAssignedToUser } from "./store/bugs"

const actions = {
    ...projectsActions,
    ...bugsActions,
    ...usersActions,
    ...apiActions,
}

const store = configureStore()

// UI layer
store.dispatch(actions.loadBugs())

setTimeout(() => {
    store.dispatch(actions.loadBugs())
}, 3000)
