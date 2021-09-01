import axios from "axios"
import MockAdapter from "axios-mock-adapter"

import configureStore from "../configureStore"
import { addBug } from "../bugs"

describe("bugsSlice", () => {
    let fakeAxios
    let store

    beforeEach(() => {
        fakeAxios = new MockAdapter(axios)
        store = configureStore()
    })

    it("should save bug in the store if bug successfully saved on server", async () => {
        const bug = { description: "a" }
        const savedBug = { ...bug, id: 1 }

        fakeAxios.onPost("/bugs").reply(200, savedBug)

        await store.dispatch(addBug(bug))

        expect(bugsSlice().list).toContainEqual(savedBug)
    })

    it("should NOT save bug in the store if bug NOT successfully saved on server", async () => {
        const bug = { description: "a" }

        fakeAxios.onPost("/bugs").reply(500)

        await store.dispatch(addBug(bug))

        expect(bugsSlice().list).toHaveLength(0)
    })

    function bugsSlice() {
        return store.getState().entities.bugs
    }
})
