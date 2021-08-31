export const logger = (type) => (store) => (next) => (action) => {
    console.log("Logging:", type)
    next(action)
}
