import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    students: [], // select students for scheduling session
    batches: [], // select batches for scheduling session
    userId: '',
    userName: '',
    sessionEventData: [],
    slotsLeaveData : [],
    sessionData: null, // select session data to edit
    sessionCancelData : [],

    createNewSlotPopup: false, // for new slot popup
    scheduleNewSessionPopup: false, //  for new session Popup
    selectStudentPopup: false,
    selectBatchPopup: false,
    markLeave: false,
    createdSlots: false,
    openCreatedSessions : false,
    openCancelSession : false,

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
            console.log('PAYLOAD DATA :', action.payload);
            state.scheduleNewSessionPopup = true;
            if (action.payload?.studentId) {
                state.students = action.payload.studentId;
            }
            if (action.payload?.batchId) {
                state.batches = action.payload.batchId;
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
        openCreatedSessions : (state, action) => {
            console.log("PAYLOAD ", action.payload);
            state.openCreatedSessions = true;
            state.slotsLeaveData = action.payload;
        },
        closeCreatedSessions : (state, action) => {
            state.openCreatedSessions = false;
        },
        openCancelSessionPopup : (state, action) => {
            state.openCancelSession = true;
            state.sessionCancelData = action.payload;
        },
        closeCancelSessionPopup : (state, action) => {
            state.openCancelSession = false;
        },



        openSessionPopup(state, action) {
            state.sessionEventData = action.payload;
            state.openSession = true;
        },
        closeSessionPopup(state, action) {
            state.sessionEventData = [];
            state.openSession = false;
        },

        openEditSession(state, action) {
            state.editSession = true;
            state.sessionData = action.payload;
        },
        closeEditSession(state, action) {
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
    openCreatedSessions,
    closeCreatedSessions,
    openCancelSessionPopup,
    closeCancelSessionPopup,


    openSessionPopup,
    closeSessionPopup,
    openEditSession,
    closeEditSession,
} = commonCalender.actions;

export default commonCalender.reducer;
