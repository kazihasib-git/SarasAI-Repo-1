import { createSlice } from '@reduxjs/toolkit';
import store from '../../store.js';

const initialState = {
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  offset: new Date().getTimezoneOffset(), // offset in minutes
};

const timeZoneSlice = createSlice({
  name: 'timeZone',
  initialState,
  reducers: {
    setTimeZone: (state, action) => {
      state.timeZone = action.payload;
      state.offset = new Date().getTimezoneOffset(); 
    },
    adjustOffset: (state, action) => {
      state.offset = action.payload;
    },
  },
});

export const { setTimeZone, adjustOffset } = timeZoneSlice.actions;

export default timeZoneSlice.reducer;


export const utcToLocal = (utcTime) => {
  const { offset } = store.getState().timeZone;
  const localTime = new Date(utcTime);
  localTime.setMinutes(localTime.getMinutes() - offset);
  return localTime;
};
  
// Convert local time to UTC
export const localToUtc = (localTime) => {
  const { offset } = store.getState().timeZone;
  const utcTime = new Date(localTime);
  utcTime.setMinutes(utcTime.getMinutes() + offset);
  return utcTime;
};
  
// Function to change the time zone
export const changeTimeZone = (newTimeZone) => {
  store.dispatch(setTimeZone(newTimeZone));
};