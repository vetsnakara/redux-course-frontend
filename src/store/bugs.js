import moment from "moment"
import { actionCreator, createSlice } from "@reduxjs/toolkit"
import { createSelector } from "reselect"

import { apiCallBegan } from "./api"

import config from "../config"

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
            const bug = action.payload
            const index = bugs.list.findIndex(({ id }) => id === bug.id)
            bugs.list[index] = bug
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

const {
    bugAdded,
    bugRemoved,
    bugResolved,
    bugAssigned,
    bugsReceived,
    loadingStarted,
    loadingFinished,
} = slice.actions

export function loadBugs() {
    return (dispatch, getState) => {
        const { lastFetch } = getState().entities.bugs

        const timeDiff = lastFetch ? moment().diff(moment(lastFetch)) : null

        console.log("timeDiff", timeDiff)

        if (timeDiff !== null && timeDiff < config.cacheInvalidationTime) return

        const apiAction = apiCallBegan({
            url: URL,
            onSuccess: bugsReceived.type,
            onStart: loadingStarted.type,
            onFinish: loadingFinished.type,
        })

        return dispatch(apiAction)
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

export function assignBug({ bugId, userId }) {
    return apiCallBegan({
        url: `${URL}/${bugId}`,
        method: "PATCH",
        data: { userId },
        onSuccess: bugAssigned.type,
        onStart: loadingStarted.type,
        onFinish: loadingFinished.type,
    })
}

export function resolveBug({ id }) {
    return apiCallBegan({
        url: `${URL}/${id}`,
        method: "PATCH",
        data: { resolved: true },
        onSuccess: bugResolved.type,
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
