import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { studentsApi } from './services/students/studentsApi';
import { batchesApi } from './services/batches/batchesApi';
import { coursesApi } from './services/courses/coursesApi';
import taReducer from './features/adminModule/ta/taSlice';
import taSchedulingReducer from './features/adminModule/ta/taScheduling';
import taAvailabilityReducer from './features/adminModule/ta/taAvialability';
import coachTemplateReducer from './features/adminModule/coach/coachTemplateSlice';
import adminNotificationReducer from './features/adminModule/notification/AdminNotification';
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
import timeZoneReducer from './features/timeZone/timezone';
import linkActivityReducer from './features/adminModule/coach/LinkActivitySlice';
import coachingToolsReducer from './features/adminModule/coachingTools/coachingTools';
import batchesAndStudentsReducer from './features/commonCalender/batchesAndStudents';
import { timezonesApi } from './services/timezones/timezonesApi';
import { hostsApi } from './services/hosts/hostsApi';
import { platformsApi } from './services/platforms/platformsApi';

const store = configureStore({
    reducer: {
        auth: authReducer,
        adminNotification: adminNotificationReducer,
        taModule: taReducer,
        // taAvailability: taAvailabilityReducer,
        taScheduling: taSchedulingReducer,
        taAvialability: taAvailabilityReducer,
        coachTemplate: coachTemplateReducer,
        wol: wolSliceReducer,
        coachModule: coachReducer,
        coachAvailability: coachAvailabilityReducer,
        coachScheduling: coachSchedulingReducer,
        activityType: activityTypeReducer,
        linkActivity: linkActivityReducer,
        coachingTools: coachingToolsReducer,
        coachMenu: coachMenuSliceReducer,
        taMenu: taMenuSliceReducer,
        commonCalender: commonCalenderReducer,
        batchesAndStudents: batchesAndStudentsReducer,
        util: utilReducer,
        timeZone: timeZoneReducer,
        [studentsApi.reducerPath]: studentsApi.reducer,
        [batchesApi.reducerPath]: batchesApi.reducer,
        [coursesApi.reducerPath]: coursesApi.reducer,
        [timezonesApi.reducerPath]: timezonesApi.reducer,
        [platformsApi.reducerPath] : platformsApi.reducer,
        [hostsApi.reducerPath] : hostsApi.reducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
            .concat(studentsApi.middleware)
            .concat(batchesApi.middleware)
            .concat(coursesApi.middleware)
            .concat(timezonesApi.middleware)
            .concat(platformsApi.middleware)
            .concat(hostsApi.middleware),
});

setupListeners(store.dispatch);

export default store;
