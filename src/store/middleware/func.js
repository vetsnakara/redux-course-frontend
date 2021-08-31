export const func = (store) => (next) => (action) => {
    if (typeof action === "function") {
        action(store)
    } else {
        next(action)
    }
}
