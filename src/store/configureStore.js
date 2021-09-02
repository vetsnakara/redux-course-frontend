import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit"

import reducer from "./reducer"

import { api } from "./middleware/api"
import { logger } from "./middleware/logger"

export default function (options = {}) {
    return configureStore({
        reducer,
        middleware: [
            ...getDefaultMiddleware({
                serializableCheck: false,
            }),
            // logger,
            api,
        ],
        ...options,
    })
}
