import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { studentsApi } from './services/students/studentsApi';
import { batchesApi } from './services/batches/batchesApi';
import { coursesApi } from './services/courses/coursesApi';
import taReducer from './features/adminModule/ta/taSlice';
import taSchedulingReducer from './features/adminModule/ta/taScheduling';
import taAvailabilityReducer from './features/adminModule/ta/taAvialability';
import coachTemplateReducer from './features/adminModule/coach/coachTemplateSlice';
import wolSliceReducer from './features/adminModule/coachingTools/wol/wolSlice';
import coachReducer from './features/adminModule/coach/coachSlice';
import coachAvailabilityReducer from './features/adminModule/coach/CoachAvailabilitySlice';
import coachSchedulingReducer from './features/adminModule/coach/coachSchedule';
import activityTypeReducer from './features/adminModule/coach/activityTypeSlice';
import coachMenuSliceReducer from './features/coachModule/coachmenuprofileSilce';
import taMenuSliceReducer from './features/taModule/tamenuSlice';
import authReducer from './features/auth/authSlice';
import commonCalenderReducer from './features/commonCalender/commonCalender';
import utilReducer from './features/utils/utilSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        taModule: taReducer,
        taAvailability: taAvailabilityReducer,
        taScheduling: taSchedulingReducer,
        taAvialability: taAvailabilityReducer,
        coachTemplate: coachTemplateReducer,
        wol: wolSliceReducer,
        coachModule: coachReducer,
        coachAvailability: coachAvailabilityReducer,
        coachScheduling: coachSchedulingReducer,
        activityType: activityTypeReducer,
        coachMenu: coachMenuSliceReducer,
        taMenu: taMenuSliceReducer,
        commonCalender: commonCalenderReducer,
        util: utilReducer,
        [studentsApi.reducerPath]: studentsApi.reducer,
        [batchesApi.reducerPath]: batchesApi.reducer,
        [coursesApi.reducerPath]: coursesApi.reducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
            .concat(studentsApi.middleware)
            .concat(batchesApi.middleware)
            .concat(coursesApi.middleware),
});

setupListeners(store.dispatch);

export default store;
