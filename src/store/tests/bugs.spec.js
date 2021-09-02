import axios from "axios"
import MockAdapter from "axios-mock-adapter"
import produce from "immer"

import configureStore from "../configureStore"

import reducer from "../reducer"

import config from "../../config"

import { addBug, getUnresolvedBugs, loadBugs, resolveBug } from "../bugs"
import { before } from "lodash"

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
        const id = 1
        const unresolvedBug = { id, description: "x" }
        const resolvedBug = { ...unresolvedBug, resolved: true }

        beforeEach(() => {
            const initState = createState()

            const preloadedState = produce(initState, (state) => {
                state.entities.bugs.list.push(unresolvedBug)
            })

            store = configureStore({
                preloadedState,
            })
        })

        it("should resolve bug in store if bug successfully resolved on server", async () => {
            fakeAxios.onPatch(`/bugs/${id}`).reply(200, resolvedBug)

            await store.dispatch(resolveBug({ id }))

            const bug = bugsSlice().list[0]
            expect(bug.resolved).toBe(true)
        })

        it("should NOT resolve bug in store if bug NOT successfully resolved on server", async () => {
            fakeAxios.onPatch(`/bugs/${id}`).reply(500)

            await store.dispatch(resolveBug({ id }))

            const bug = bugsSlice().list[0]
            expect(bug.resolved).not.toBe(true)
        })
    })

    describe("loadBugs", () => {
        describe("if the bugs exist in the cache", () => {
            it("bugs should be fethced from the server", async () => {
                fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }])
                await store.dispatch(loadBugs())
                expect(bugsSlice().list.length).toBe(1)
            })

            it.only("bugs should be fetched if they don't exist in the cache", async () => {
                const timeFirst = global.Date.now()
                const timeSecond = timeFirst + config.cacheInvalidationTime

                // save global Date
                const Date = global.Date

                fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }])

                global.Date.now = () => timeFirst
                await store.dispatch(loadBugs())

                global.Date.now = () => timeSecond
                await store.dispatch(loadBugs())

                expect(fakeAxios.history.get.length).toBe(2)

                // restore global Date
                global.Date = Date
            })

            it("bugs should not be fetched from the server again", async () => {
                fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }])

                await store.dispatch(loadBugs())
                await store.dispatch(loadBugs())

                expect(fakeAxios.history.get.length).toBe(1)
            })
        })

        describe("if the bugs don't exist in the cache", () => {
            describe("loading indicator", () => {
                it("it should be false before bugs fetching begins", async () => {
                    expect(bugsSlice().loading).toBe(false)
                })

                it("it should be true while the bugs are fetching", async () => {
                    fakeAxios.onGet("/bugs").reply(() => {
                        expect(bugsSlice().loading).toBe(true)
                        return [200, [{ id: 1 }]]
                    })

                    await store.dispatch(loadBugs())
                })

                it("it should be false after the bugs are fetched", async () => {
                    fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }])
                    await store.dispatch(loadBugs())
                    expect(bugsSlice().loading).toBe(false)
                })

                it("it should be false after bugs fetching error", async () => {
                    fakeAxios.onGet("/bugs").reply(500)
                    await store.dispatch(loadBugs())
                    expect(bugsSlice().loading).toBe(false)
                })
            })
        })
    })

    describe("selectors", () => {
        describe("getUnresolvedBugs", () => {
            it("should return non-empty array", () => {
                const initState = createState()

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

            it("should return empty array", () => {
                const initState = createState()

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
    })

    function bugsSlice() {
        return store.getState().entities.bugs
    }

    function createState() {
        return reducer(undefined, { type: null })
    }
})
