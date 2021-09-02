export const logger = (store) => (next) => (action) => {
    console.log("action", action)
    return next(action)
}
