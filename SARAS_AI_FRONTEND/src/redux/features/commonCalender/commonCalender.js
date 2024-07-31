import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    students: [], // select students for scheduling session
    batches: [], // select batches for scheduling session
    userId: '',
    userName: '',
    sessionEventData: [],
    sessionData: null, // select session data to edit

    createNewSlotPopup: false, // for new slot popup
    scheduleNewSessionPopup: false, //  for new session Popup
    selectStudentPopup: false,
    selectBatchPopup: false,
    markLeave: false,
    createdSlots: false,
    openSession: false,
    editSession: false,
};

const commonCalender = createSlice({
    name: 'commonCalender',
    initialState,
    reducers: {
        // For New Slot
        openCreateNewSlot: (state, action) => {
            state.createNewSlotPopup = true;
        },
        closeCreateNewSlot: (state, action) => {
            state.createNewSlotPopup = false;
        },

        // For New Session
        openScheduleNewSession: (state, action) => {
            console.log('Payload :', action.payload);
            console.log('PAYLOAD DATA :', action.payload);
            state.scheduleNewSessionPopup = true;
            if (action.payload?.students) {
                state.students = action.payload.students;
            }
            if (action.payload?.batches) {
                state.batches = action.payload.batches;
            }
        },
        closeScheduleNewSession: (state, action) => {
            state.scheduleNewSessionPopup = false;
            state.students = [];
            state.batches = [];
        },
        openSelectStudents: (state, action) => {
            state.selectStudentPopup = true;
            // asign students
        },
        closeSelectStudents: (state, action) => {
            state.selectStudentPopup = false;
        },
        openSelectBatches: (state, action) => {
            state.selectBatchPopup = true;
        },
        closeSelectBatches: (state, action) => {
            state.selectBatchPopup = false;
        },

        // For Leave
        openMarkLeaveDate: (state, action) => {
            state.markLeave = true;
        },
        closeMarkLeaveDate: (state, action) => {
            state.markLeave = false;
        },
        openCreatedSlots: (state, action) => {
            state.createdSlots = true;
        },
        closeCreatedSlots: (state, action) => {
            state.createdSlots = false;
        },
        openSessionPopup(state, action) {
            state.sessionEventData = action.payload;
            state.openSession = true;
        },
        closeSessionPopup(state, action) {
            state.sessionEventData = [];
            state.openSession = false;
        },

        openEditSession: (state, action) => {
            state.editSession = true;
            state.sessionData = action.payload;
        },
        closeEditSession: (state, action) => {
            state.editSession = false;
            state.sessionData = null;
        },
    },
});

export const {
    openCreateNewSlot,
    closeCreateNewSlot,
    openScheduleNewSession,
    closeScheduleNewSession,
    openSelectStudents,
    closeSelectStudents,
    openSelectBatches,
    closeSelectBatches,
    openMarkLeaveDate,
    closeMarkLeaveDate,
    openCreatedSlots,
    closeCreatedSlots,
    openSessionPopup,
    closeSessionPopup,
    openEditSession,
    closeEditSession,
} = commonCalender.actions;

export default commonCalender.reducer;
