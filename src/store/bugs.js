import { createSlice } from "@reduxjs/toolkit"
import { createSelector } from "reselect"

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
                userId: null,
            })
        },
        bugResolved: (bugs, action) => {
            const { id } = action.payload
            const index = bugs.findIndex((bug) => bug.id === id)
            bugs[index].resolved = true
        },
        bugRemoved: (bugs, action) => {
            const { id } = action.payload
            const index = bugs.findIndex((bug) => bug.id === id)
            bugs.splice(index, 1)
        },
        bugAssigned: (bugs, action) => {
            const { bugId, userId } = action.payload
            const index = bugs.findIndex((bug) => bug.id === userId)
            bugs[bugId].userId = userId
        },
    },
})

export const { bugAdded, bugRemoved, bugResolved, bugAssigned } = slice.actions

export const getUnresolvedBugs = createSelector(
    (state) => state.entities.bugs,
    (bugs) => bugs.filter((bug) => !bug.resolved)
)

export function getBugsAssignedToUser(userId) {
    return createSelector(
        (state) => state.entities.bugs,
        (bugs) => bugs.filter((bug) => bug.userId === userId)
    )
}

export default slice.reducer
