import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    students: [], // select students for scheduling session
    batches: [], // select batches for scheduling session
    preSelectedStudents: [], //already Selected Students for edit session
    preSelectedBatches: [], //already Selected Students for edit batches
    userId: '',
    userName: '',
    sessionEventData: [],
    slotsLeaveData: [],
    sessionData: null, // select session data to edit
    sessionCancelData: [],
    sessionDataForReschdeule: [],

    createNewSlotPopup: false, // for new slot popup
    scheduleNewSessionPopup: false, //  for new session Popup
    editSchedulePopup : false,
    selectStudentPopup: false,
    selectBatchPopup: false,
    markLeave: false,
    createdSlots: false,
    openCreatedSessions: false,
    openCancelSession: false,
    RescheduleSession: false,

    openSession: false,
    editSession: false,

    editStudents: [],
    editBatches: [],
    meetingId: null,
    openEditStudentsPopup: false,
    openEditBatchesPopup: false,

    dataToFindScheduleInSlot:null,
    participantsDialogOpen:false,
    selectedParticipants:[],
    editParticipantsDialogOpen:false,
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
            state.preSelectedStudents = action.payload ? action.payload: [];
            if(action.payload?.editStudents){
                state.editStudents = action.payload.editStudents;
            }
            // asign students
        },
        closeSelectStudents: (state, action) => {
            state.selectStudentPopup = false;
            state.preSelectedStudents = [];
            // state.editStudents = [];
            
        },
        openSelectBatches: (state, action) => {
            console.log("action payload", action.payload)
            state.selectBatchPopup = true;
            state.preSelectedBatches = action.payload || [];
            if(action.payload?.editBatches){
                state.editBatches = action.payload.editBatches
            }
        },
        closeSelectBatches: (state, action) => {
            state.selectBatchPopup = false;
            state.preSelectedBatches = [];
            // state.editBatches = [];
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
        openCreatedSessions: (state, action) => {
            state.openCreatedSessions = true;
            state.slotsLeaveData = action.payload;
        },
        closeCreatedSessions: (state, action) => {
            state.openCreatedSessions = false;
        },
        openCancelSessionPopup: (state, action) => {
            state.openCancelSession = true;
            state.sessionCancelData = action.payload;
        },
        closeCancelSessionPopup: (state, action) => {
            state.openCancelSession = false;
        },
        openReasonForLeavePopup: (state, action) => {
            state.openLeaveReason = true;
            state.slotsLeaveData = action.payload;
        },
        closeReasonForLeavePopup: (state, action) => {
            state.openLeaveReason = false;
            state.slotsLeaveData = [];
        },
        openReschedulePopup: (state, action) => {
            state.RescheduleSession = true;
            state.sessionDataForReschdeule = action.payload;
        },
        closeReschedulePopup: (state, action) => {
            state.RescheduleSession = false;
        },
        openSessionPopup(state, action) {
            state.sessionEventData = action.payload;
            state.openSession = true;
        },
        closeSessionPopup(state, action) {
            state.sessionEventData = [];
            state.openSession = false;
        },
        openEditStudents(state, action){
            state.openEditStudentsPopup = true;
            state.meetingId = action.payload.id;
        },
        closeEditStudents(state, action) {
            state.openEditStudentsPopup = false;
        },
        openEditBatches(state, action) {
            state.openEditBatchesPopup = true;
            state.meetingId = action.payload.id;
        },
        closeEditBatches(state, action) {
            state.openEditBatchesPopup = false;
        },

        openEditSession(state, action) {
            console.log("ACTION PAYLOAD", action.payload)
            state.editSession = true;
            state.sessionData = action.payload.sessionData;
            if(action.payload.studentId){
                state.editStudents = action.payload.studentId;
            }
            if(action.payload.batchId){
                state.editBatches = action.payload.batchId;
            }
        },
        closeEditSession(state, action) {
            state.editSession = false;
            state.sessionData = [];
            state.editBatches = [];
            state.editStudents = [];
        },
        //add data from slot in reschedule to find sessions again after rescheduling
        addDataToFindScheduleInSlot(state, action) {
            state.dataToFindScheduleInSlot = action.payload;
        },

        openParticipantsDialog: (state, action) => {
            console.log('openParticipantsDialog Call' , action.payload ) ; 
            state.participantsDialogOpen = true;
            state.selectedParticipants = action.payload;
          },
          closeParticipantsDialog: (state) => {
            console.log('closeParticipantsDialog Call') ; 

            state.participantsDialogOpen = false;
            state.selectedParticipants = [];
          },
        openEditParticipantsDialog: (state, action) => {
            console.log('openEditParticipantsDialog Call' , action.payload ) ; 
            state.editParticipantsDialogOpen = true;
            state.selectedParticipants = action.payload;
          },
          closeEditParticipantsDialog: (state) => {
            console.log('closeEditParticipantsDialog') ;
            state.editParticipantsDialogOpen = false;
            // state.selectedEditedParticipants = [];
          },
    },
});

export const {
    openParticipantsDialog,
    closeParticipantsDialog,
    openEditParticipantsDialog,
    closeEditParticipantsDialog,
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
    openReasonForLeavePopup,
    closeReasonForLeavePopup,
    openReschedulePopup,
    closeReschedulePopup,

    openSessionPopup,
    closeSessionPopup,
    openEditSession,
    closeEditSession,
    openEditStudents,
    closeEditStudents,
    openEditBatches,
    closeEditBatches,
    addDataToFindScheduleInSlot,
} = commonCalender.actions;

export default commonCalender.reducer;
