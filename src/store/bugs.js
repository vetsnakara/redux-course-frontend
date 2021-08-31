import { createSlice } from "@reduxjs/toolkit"
import {createSelector} from "reselect"

let lastId = 0

const slice = createSlice({
    name: "bugs",
    initialState: [],
    reducers: {
        bugAdded: (bugs, action) => {
            bugs.push({
                id: lastId++,
                description: action.payload.description,
                resolved: false,
            })
        },
        bugResolved: (bugs, action) => {
            const index = bugs.findIndex((bug) => bug.id === action.payload.id)
            bugs[index].resolved = true
        },
        bugRemoved: (bugs, action) => {
            const index = bugs.findIndex((bug) => bug.id === action.payload.id)
            bugs.splice(index, 1)
        },
    },
})

export const { bugAdded, bugRemoved, bugResolved } = slice.actions

// Memoized Selector
export const getUnresolvedBugs = createSelector(
    state => state.entities.bugs,
    bugs => bugs.filter(bug => !bug.resolved)
)

export default slice.reducer
