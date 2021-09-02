import axios from "axios"
import MockAdapter from "axios-mock-adapter"
import produce from "immer"

import configureStore from "../configureStore"

import reducer from "../reducer"

import { addBug, getUnresolvedBugs, loadBugs, resolveBug } from "../bugs"

describe("bugsSlice", () => {
    let fakeAxios
    let store

    beforeEach(() => {
        fakeAxios = new MockAdapter(axios)
        store = configureStore()
    })

    describe("addBug", () => {
        it("should add bug in the store if bug successfully saved on server", async () => {
            const bug = { description: "a" }
            const savedBug = { ...bug, id: 1 }

            fakeAxios.onPost("/bugs").reply(200, savedBug)

            await store.dispatch(addBug(bug))

            expect(bugsSlice().list).toContainEqual(savedBug)
        })

        it("should NOT add bug in the store if bug NOT successfully saved on server", async () => {
            const bug = { description: "a" }

            fakeAxios.onPost("/bugs").reply(500)

            await store.dispatch(addBug(bug))

            expect(bugsSlice().list).toHaveLength(0)
        })
    })

    describe("resolveBug", () => {
        const unresolvedBug = { id: 1, description: "x", resolved: false }
        const resolvedBug = { ...unresolvedBug, resolved: true }

        beforeEach(() => {
            const initState = getInitState()

            const preloadedState = produce(initState, (state) => {
                state.entities.bugs.list.push(unresolvedBug)
            })

            store = configureStore({
                preloadedState,
            })
        })

        it("should resolve bug in store if bug successfully resolved on server", async () => {
            fakeAxios
                .onPatch(`/bugs/${unresolvedBug.id}`)
                .reply(200, resolvedBug)

            await store.dispatch(resolveBug({ id: unresolvedBug.id }))

            expect(bugsSlice().list).toContainEqual(resolvedBug)
        })

        it("should NOT resolve bug in store if bug NOT successfully resolved on server", async () => {
            fakeAxios.onPatch(`/bugs/${unresolvedBug.id}`).reply(500)

            await store.dispatch(resolveBug({ id: unresolvedBug.id }))

            expect(bugsSlice().list).toContainEqual(unresolvedBug)
        })
    })

    describe("loadBugs", () => {
        it("should add loaded bugs to the store", async () => {
            const bugs = [
                {
                    id: 1,
                    description: "Bug 1",
                    userId: 1,
                    resolved: true,
                },
                {
                    id: 2,
                    description: "Bug 2",
                    userId: 1,
                    resolved: true,
                },
            ]

            fakeAxios.onGet("/bugs").reply(200, bugs)

            await store.dispatch(loadBugs())

            expect(bugsSlice().list).toHaveLength(bugs.length)
        })

        it("should NOT add bugs to store if bugs loading failed", async () => {
            fakeAxios.onGet("/bugs").reply(500)

            await store.dispatch(loadBugs())

            expect(bugsSlice().list).toHaveLength(0)
        })
    })

    describe("getUnresolvedBugs", () => {
        it("should get unresolved bugs from store (if any)", () => {
            const initState = getInitState()

            const bugs = [
                {
                    id: 1,
                    description: "Bug 1",
                    userId: 1,
                    resolved: false,
                },
                {
                    id: 2,
                    description: "Bug 2",
                    userId: 1,
                    resolved: true,
                },
            ]

            const preloadedState = produce(initState, (state) => {
                state.entities.bugs.list = bugs
            })

            store = configureStore({
                preloadedState,
            })

            const state = store.getState()

            const unresolvedBugs = getUnresolvedBugs(state)

            expect(unresolvedBugs).toHaveLength(
                bugs.filter((b) => !b.resolved).length
            )
        })

        it("should return empty array from store (if no unresolved bugs)", () => {
            const initState = getInitState()

            const bugs = [
                {
                    id: 1,
                    description: "Bug 1",
                    userId: 1,
                    resolved: true,
                },
                {
                    id: 2,
                    description: "Bug 2",
                    userId: 1,
                    resolved: true,
                },
            ]

            const preloadedState = produce(initState, (state) => {
                state.entities.bugs.list = bugs
            })

            store = configureStore({
                preloadedState,
            })

            const state = store.getState()

            const unresolvedBugs = getUnresolvedBugs(state)

            expect(unresolvedBugs).toHaveLength(0)
        })
    })

    function bugsSlice() {
        return store.getState().entities.bugs
    }

    function getInitState() {
        return reducer(undefined, { type: null })
    }
})
