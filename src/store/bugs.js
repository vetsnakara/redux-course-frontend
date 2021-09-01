import { actionCreator, createSlice } from "@reduxjs/toolkit"
import { createSelector } from "reselect"

import moment from "moment"

import { apiCallBegan } from "./api"

// todo: place in config file
const URL = "/bugs"

const slice = createSlice({
    name: "bugs",
    initialState: {
        list: [],
        loading: false,
        lastFetch: null,
    },
    reducers: {
        bugAdded: (bugs, action) => {
            bugs.list.push(action.payload)
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
            bugs.lastFetch = Date.now()
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

// todo: generalize caching solution to use in different slices
export function loadBugs() {
    return (dispatch, getState) => {
        const { lastFetch } = getState().entities.bugs

        const timeDiff = moment().diff(moment(lastFetch), "seconds")

        // todo: store max diff in config file
        if (timeDiff < 5) return

        const apiAction = apiCallBegan({
            url: URL,
            onSuccess: bugsReceived.type,
            onStart: loadingStarted.type,
            onFinish: loadingFinished.type,
        })

        dispatch(apiAction)
    }
}

export function addBug(bug) {
    return apiCallBegan({
        url: URL,
        method: "POST",
        data: bug,
        onSuccess: bugAdded.type,
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
