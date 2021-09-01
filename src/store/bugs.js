import { actionCreator, createSlice } from "@reduxjs/toolkit"
import { createSelector } from "reselect"

import { apiCallBegan } from "./api"

const URL = "/bugs"

let lastId = 0

const slice = createSlice({
    name: "bugs",
    initialState: {
        list: [],
        loading: false,
        lastFetch: null,
    },
    reducers: {
        bugAdded: (bugs, action) => {
            bugs.list.push({
                id: lastId++,
                description: action.payload.description,
                resolved: false,
                userId: null,
            })
        },
        bugResolved: (bugs, action) => {
            const { id } = action.payload
            const index = bugs.list.findIndex((bug) => bug.id === id)
            bugs.list[index].resolved = true
        },
        bugRemoved: (bugs, action) => {
            const { id } = action.payload
            const index = bugs.list.findIndex((bug) => bug.id === id)
            bugs.list.splice(index, 1)
        },
        bugAssigned: (bugs, action) => {
            const { bugId, userId } = action.payload
            const index = bugs.list.findIndex((bug) => bug.id === userId)
            bugs.list[bugId].userId = userId
        },
        bugsReceived: (bugs, action) => {
            bugs.list = action.payload
        },
        loadingStarted: (bugs) => {
            bugs.loading = true
        },
        loadingFinished: (bugs) => {
            bugs.loading = false
        },
    },
})

export const {
    bugAdded,
    bugRemoved,
    bugResolved,
    bugAssigned,
    bugsReceived,
    loadingStarted,
    loadingFinished,
} = slice.actions

export function loadBugs() {
    return apiCallBegan({
        url: URL,
        onSuccess: bugsReceived.type,
        onStart: loadingStarted.type,
        onFinish: loadingFinished.type,
    })
}

export const getUnresolvedBugs = createSelector(
    (state) => state.entities.bugs,
    (bugs) => bugs.list.filter((bug) => !bug.resolved)
)

export function getBugsAssignedToUser(userId) {
    return createSelector(
        (state) => state.entities.bugs,
        (bugs) => bugs.list.filter((bug) => bug.userId === userId)
    )
}

export default slice.reducer
