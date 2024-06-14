import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    
    //TODO : Add the reducer here
    reducer: {
        students : dataReducer,
    },
});