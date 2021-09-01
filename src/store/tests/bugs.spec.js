import { apiCallBegan } from "../api"
import { addBug, bugAdded, loadingStarted, loadingFinished } from "../bugs"

describe("bugsSlice", () => {
    describe("action creators", () => {
        it("addBug", () => {
            const bug = { description: "a" }

            const action = addBug(bug)

            expect(action).toEqual({
                type: apiCallBegan.type,
                payload: {
                    url: "/bugs",
                    method: "POST",
                    data: bug,
                    onSuccess: bugAdded.type,
                    onStart: loadingStarted.type,
                    onFinish: loadingFinished.type,
                },
            })
        })
    })
})
