import configureStore from "./store/configureStore"

import * as projectsActions from "./store/projects"
import * as bugsActions from "./store/bugs"
import * as usersActions from "./store/users"

import { getBugsAssignedToUser } from "./store/bugs"

const actions = {
    ...projectsActions,
    ...bugsActions,
    ...usersActions,
}

const store = configureStore()

store.dispatch(actions.bugAdded({ description: "Bug 1" }))
store.dispatch(actions.bugAdded({ description: "Bug 2" }))
store.dispatch(actions.bugAdded({ description: "Bug 3" }))
store.dispatch(actions.bugResolved({ id: 0 }))
store.dispatch(actions.bugRemoved({ id: 0 }))

store.dispatch(actions.projectAdded({ name: "project 1" }))
store.dispatch(actions.projectAdded({ name: "project 2" }))
store.dispatch(actions.projectAdded({ name: "project 3" }))
store.dispatch(actions.projectRemoved({ id: 0 }))

store.dispatch(actions.userAdded({ name: "John" }))
store.dispatch(actions.userAdded({ name: "Kostya" }))

store.dispatch(actions.bugAssigned({ bugId: 0, userId: 0 }))

console.log(getBugsAssignedToUser(0)(store.getState()))
