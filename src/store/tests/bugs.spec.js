import axios from "axios"
import MockAdapter from "axios-mock-adapter"

import { addBug } from "../bugs"
import configureStore from "../configureStore"

describe("bugsSlice", () => {
    it("should handle the adding bug", async () => {
        const fakeAxios = new MockAdapter(axios)

        const bug = { description: "a" }
        const savedBug = { ...bug, id: 1 }

        fakeAxios.onPost("/bugs").reply(200, savedBug)

        const { dispatch, getState } = configureStore()

        await dispatch(addBug(bug))

        expect(getState().entities.bugs.list).toContainEqual(savedBug)
    })
})
