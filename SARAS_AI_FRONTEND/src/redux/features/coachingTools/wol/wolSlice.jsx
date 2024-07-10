import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    openAddEditWolCategory: false,
}

const wolSlice = createSlice({
  name: 'wol',
  initialState,
  reducers: {
    setAddEditWolCategory : (state, action) => {
      state.openAddEditWolCategory = action.payload
    }
  },
});

export const {
  setAddEditWolCategory,
} = wolSlice.actions

export default wolSlice.reducer