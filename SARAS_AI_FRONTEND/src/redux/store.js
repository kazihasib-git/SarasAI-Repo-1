import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { studentsApi } from './services/students/studentsApi';
import { batchesApi } from './services/batches/batchesApi';
import { coursesApi } from './services/courses/coursesApi';
import taReducer from './features/taModule/taSlice';
import taSchedulingReducer from './features/taModule/taScheduling';

const store = configureStore({

    reducer: {
        taModule: taReducer,
        taScheduling : taSchedulingReducer,
        [studentsApi.reducerPath]: studentsApi.reducer,
        [batchesApi.reducerPath]: batchesApi.reducer,
        [coursesApi.reducerPath]: coursesApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(studentsApi.middleware).concat(batchesApi.middleware).concat(coursesApi.middleware),
});

setupListeners(store.dispatch);

export default store;