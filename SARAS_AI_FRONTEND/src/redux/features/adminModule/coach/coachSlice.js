import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { baseUrl } from '../../../../utils/baseURL';
import axiosInstance from '../../../services/httpService';
import { toast } from 'react-toastify';

export const createCoach = createAsyncThunk(
    'coachModule/createCoach',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/admin/manage_coaches`,
                data
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Creating Coach'
                );
            }
        }
    }
);

export const getCoach = createAsyncThunk(
    'coachModule/getCoach',
    async rejectWithValue => {
        try {
            const response = await axiosInstance.get(
                `${baseUrl}/admin/manage_coaches`
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Fetching Coaches'
                );
            }
        }
    }
);

export const getCoachById = createAsyncThunk(
    'coachModule/getCoachById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `${baseUrl}/admin/manage_coaches/${id}`
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Fetching Coaches By Id'
                );
            }
        }
    }
);

export const updateCoach = createAsyncThunk(
    'coachModule/updateCoach',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `${baseUrl}/admin/manage_coaches/${id}`,
                data
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Updating Coach'
                );
            }
        }
    }
);

export const activate_deactivate_Coach = createAsyncThunk(
    'coachModule/activate_deactivate_Coach',
    async ({ id }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(
                `${baseUrl}/admin/manage_coaches/active-deactive/${id}`
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue('An Error Occurred While Editing Coach');
            }
        }
    }
);
export const deleteCoach = createAsyncThunk(
    'coachModule/deleteCoach',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`${baseUrl}/admin/manage_coaches/${id}`);
            return id;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Deleting Coach'
                );
            }
        }
    }
);

export const getCoachStudentBatchMapping = createAsyncThunk(
    'coachModule/getCoachStudentBatchMapping',
    async rejectWithValue => {
        try {
            const response = await axiosInstance.get(
                `${baseUrl}/admin/student-batch-mapping/getAllStudentWithBatches`
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Fetching Students'
                );
            }
        }
    }
);

export const getCoachBatchMapping = createAsyncThunk(
    'coachModule/getCoachBatchMapping',
    async rejectWithValue => {
        try {
            const response = await axiosInstance.get(
                `${baseUrl}/admin/batches`
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Fetching Batches'
                );
            }
        }
    }
);

export const showCoachMapping = createAsyncThunk(
    'coachModule/showCoachMapping',
    async rejectWithValue => {
        try {
            const response = await axiosInstance.get(
                `${baseUrl}/admin/CoachMapping/CoachswithActiveStudentnBatches`
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Fetching Batches'
                );
            }
        }
    }
);

export const showCoachCourseMapping = createAsyncThunk(
    'coachModule/showCoachCourseMapping',
    async rejectWithValue => {
        try {
            const response = await axiosInstance.get(
                `${baseUrl}/admin/coach-course/getAllCoachesWithCourses`
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Fetching Courses'
                );
            }
        }
    }
);

export const getAllCoursesWithCoaches = createAsyncThunk(
    'coachModule/getAllCoursesWithCoaches',
    async rejectWithValue => {
        try {
            const response = await axiosInstance.get(
                `${baseUrl}/admin/coach-course/getAllCoursesWithCoaches`
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Fetching Coach Courses'
                );
            }
        }
    }
);

export const assignCourseToCoach = createAsyncThunk(
    'coachModule/assignCourseToCoach',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/admin/coach-course`,
                data
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Assigning Course'
                );
            }
        }
    }
);

export const getCoachAssignStudents = createAsyncThunk(
    'coachModule/getCoachAssignStudents',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `${baseUrl}/admin/CoachMapping/${id}/AssignStudents`
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Fetching Assigned Students To TA'
                );
            }
        }
    }
);

export const getCoachAssignBatches = createAsyncThunk(
    'coachModule/getCoachAssignBatches',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `${baseUrl}/admin/CoachMapping/${id}/AssignBatches`
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Fetching Assigned Batches'
                );
            }
        }
    }
);

export const postCoachAssignStudents = createAsyncThunk(
    'coachModule/postCoachAssignStudents',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/admin/CoachMapping/AssignStudents`,
                data
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Fetching Assigning Students'
                );
            }
        }
    }
);

export const postCoachAssignBatches = createAsyncThunk(
    'coachModule/postCoachAssignBatches',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/admin/CoachMapping/AssignBatches`,
                data
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Fetching Assigned Batches'
                );
            }
        }
    }
);

export const toggleCoachAssignStudentStatus = createAsyncThunk(
    'coachModule/toggleCoachAssignStudentStatus',
    async ({ id, studentId }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `${baseUrl}/admin/CoachMapping/${id}/ActiveDeactiveAssignStudent`,
                { student_id: studentId }
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Updating Assigned Student'
                );
            }
        }
    }
);

export const toggleCoachAssignBatchStatus = createAsyncThunk(
    'coachModule/toggleCoachAssignBatchStatus',
    async ({ id, batchId }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `${baseUrl}/admin/CoachMapping/${id}/ActiveDeactiveAssignBatch`,
                { batch_id: batchId }
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Changing the Status of Batch'
                );
            }
        }
    }
);

export const deleteCoachAssignedStudent = createAsyncThunk(
    'coachModule/deleteCoachAssignedStudent',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(
                `${baseUrl}/admin/CoachMapping/${id.id}/deleteStudent`
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Deleting Assigned Student'
                );
            }
        }
    }
);

export const deleteCoachAssignedBatch = createAsyncThunk(
    'coachModule/deleteCoachAssignedBatch',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(
                `${baseUrl}/admin/CoachMapping/${id.id}/deleteBatch`
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Deleting Assigned Batch To Coach'
                );
            }
        }
    }
);

export const deleteCoachMapping = createAsyncThunk(
    'coachModule/deleteCoachMapping',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(
                `${baseUrl}/admin/CoachMapping/${id}/deleteMapping`
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Deleting Coach Mapping'
                );
            }
        }
    }
);

const initialState = {
    coaches: [],
    coachData: [],
    coachStudentBatchMapping: [],
    coachBatchMapping: null,
    coachMapping: null,
    coachCourseMappingData: [],
    allCoursesWithCoaches: [],
    coachSchedule: null,
    assignedStudents: [],
    assignedBatches: [],
    loading: false,
    error: null,
    createCoachOpen: false,
    editCoachOpen: false,
    selectedCoach: null,
    coachSuccessPopup: false,
    assignCoachStudentOpen: false,
    assignCoachBatchOpen: false,
    coach_name: null,
    coachID: null,
};

export const coachSlice = createSlice({
    name: 'coachModule',
    initialState,
    reducers: {
        accessCoachName(state, action) {
            state.coach_name = action.payload.name;
            state.coachID = action.payload.id;
        },
        setSelectedCoach(state, action) {
            state.selectedCoach = action.payload;
        },
        openCreateCoach(state) {
            state.createCoachOpen = true;
        },
        closeCreateCoach(state) {
            state.createCoachOpen = false;
        },
        openEditCoach(state) {
            state.editCoachOpen = true;
        },
        closeEditCoach(state) {
            state.editCoachOpen = false;
        },

        openCoachSuccessPopup(state) {
            state.coachSuccessPopup = true;
        },
        closeCoachSuccessPopup(state) {
            state.coachSuccessPopup = false;
        },
        openCoachAssignStudents(state) {
            state.assignCoachStudentOpen = true;
        },
        closeCoachAssignStudents(state) {
            state.assignCoachStudentOpen = false;
        },
        openCoachAssignBatches(state) {
            state.assignCoachBatchOpen = true;
        },
        closeCoachAssignBatches(state) {
            state.assignCoachBatchOpen = false;
        },
    },
    extraReducers: builder => {
        // Create COACH
        builder.addCase(createCoach.pending, state => {
            state.loading = true;
        });
        builder.addCase(createCoach.fulfilled, (state, action) => {
            state.loading = false;
            toast.success(
                action.payload.nessage || 'Coach Created Successfully'
            );
            state.coaches = [...state.coaches, action.payload];
        });
        builder.addCase(createCoach.rejected, (state, action) => {
            state.loading = false;
            toast.error(
                action.payload || 'Failed To Create Coach. Please Try Again'
            );
            state.error = action.payload || action.error.message;
        });

        // Get All COACH
        builder.addCase(getCoach.pending, state => {
            state.loading = true;
        });
        builder.addCase(getCoach.fulfilled, (state, action) => {
            state.loading = false;
            state.coaches = action.payload;
        });
        builder.addCase(getCoach.rejected, (state, action) => {
            state.loading = false;
            state.coaches = [];
            state.error = action.payload || action.error.message;
        });

        builder.addCase(getCoachById.pending, state => {
            state.loading = true;
        });
        builder.addCase(getCoachById.fulfilled, (state, action) => {
            state.loading = false;
            state.coachData = action.payload;
        });
        builder.addCase(getCoachById.rejected, (state, action) => {
            state.loading = false;
            state.coachData = [];
            state.error = action.payload || action.error.message;
        });

        // Update Coach
        builder.addCase(updateCoach.pending, state => {
            state.loading = true;
        });
        builder.addCase(updateCoach.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.coaches.findIndex(
                coach => coach.id === action.payload.id
            );
            if (index !== -1) {
                state.coaches[index] = action.payload;
            }
            toast.success(
                action.payload.message || 'Coach Updated Successfully'
            );
        });
        builder.addCase(updateCoach.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            toast.error(
                action.payload || 'Failed To Update Coach. Please Try Again'
            );
        });

        // activate deactive coach

        builder.addCase(activate_deactivate_Coach.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            activate_deactivate_Coach.fulfilled,
            (state, action) => {
                state.loading = false;
                const index = state.coaches.findIndex(
                    coach => coach.id === action.payload.id
                );
                if (index !== -1) {
                    state.coaches[index] = action.payload;
                }
                toast.success(
                    action.payload.message || 'Coach edited Successfully'
                );
            }
        );
        builder.addCase(activate_deactivate_Coach.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            toast.error(
                action.payload || 'Failed To edit Coach. Please Try Again'
            );
        });

        // Delete Coach
        builder.addCase(deleteCoach.pending, state => {
            state.loading = true;
        });
        builder.addCase(deleteCoach.fulfilled, (state, action) => {
            state.loading = false;
            state.coaches = state.coaches.filter(
                coach => coach.id !== action.payload
            );
            toast.success(
                action.payload.message || 'Coach Deleted Successfully'
            );
        });
        builder.addCase(deleteCoach.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            toast.error(action.payload || 'Failed To Delete Coach');
        });

        // Get Assigned Students
        builder.addCase(getCoachAssignStudents.pending, state => {
            state.loading = true;
        });
        builder.addCase(getCoachAssignStudents.fulfilled, (state, action) => {
            state.loading = false;
            state.assignedStudents = action.payload.data;
        });
        builder.addCase(getCoachAssignStudents.rejected, (state, action) => {
            state.loading = false;
            state.assignedStudents = [];
            state.error = action.payload || action.error.message;
        });

        // Get Assigned Batches
        builder.addCase(getCoachAssignBatches.pending, state => {
            state.loading = true;
        });
        builder.addCase(getCoachAssignBatches.fulfilled, (state, action) => {
            state.loading = false;
            state.assignedBatches = action.payload.data;
        });
        builder.addCase(getCoachAssignBatches.rejected, (state, action) => {
            state.loading = false;
            state.assignedBatches = [];
            state.error = action.payload || action.error.message;
        });

        // delete assigned Students
        builder.addCase(deleteCoachAssignedStudent.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            deleteCoachAssignedStudent.fulfilled,
            (state, action) => {
                state.loading = false;
                // state.assignedStudents = action.payload;
                toast.success(
                    action.payload.message ||
                        'Deleted Assigned Student Successfully'
                );
            }
        );
        builder.addCase(
            deleteCoachAssignedStudent.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                toast.error(
                    action.payload || 'Failed To Delete Assigned Student'
                );
            }
        );

        // delete coach Mapping
        builder.addCase(deleteCoachMapping.pending, state => {
            state.loading = true;
        });
        builder.addCase(deleteCoachMapping.fulfilled, (state, action) => {
            state.loading = false;
            toast.success(
                action.payload.message || 'Mapping Deleted Successully'
            );
        });
        builder.addCase(deleteCoachMapping.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            toast.error(action.payload || 'Failed To Delete Mapping');
        });

        // delete assigned Batches
        builder.addCase(deleteCoachAssignedBatch.pending, state => {
            state.loading = true;
        });
        builder.addCase(deleteCoachAssignedBatch.fulfilled, (state, action) => {
            state.loading = false;
            toast.success(
                action.payload.nessage || 'Assigned Batch Deleted Successfully'
            );
            // state.assignedStudents = action.payload;
        });
        builder.addCase(deleteCoachAssignedBatch.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            toast.error(action.payload || 'Failed To Delete Assigned Batch');
        });

        // Show CA Mapping
        builder.addCase(showCoachMapping.pending, state => {
            state.loading = true;
        });
        builder.addCase(showCoachMapping.fulfilled, (state, action) => {
            state.loading = false;
            state.coachMapping = action.payload.data;
        });
        builder.addCase(showCoachMapping.rejected, (state, action) => {
            state.loading = false;
            state.coachMapping = [];
            state.error = action.payload || action.error.message;
        });

        //coaches with course assigned
        builder.addCase(showCoachCourseMapping.pending, state => {
            state.loading = true;
        });
        builder.addCase(showCoachCourseMapping.fulfilled, (state, action) => {
            state.loading = false;
            state.coachCourseMappingData = action.payload.coaches;
        });
        builder.addCase(showCoachCourseMapping.rejected, (state, action) => {
            state.loading = false;
            state.coachCourseMappingData = [];
            state.error = action.payload || action.error.message;
        });

        //courses with coach assigned
        builder.addCase(getAllCoursesWithCoaches.pending, state => {
            state.loading = true;
        });
        builder.addCase(getAllCoursesWithCoaches.fulfilled, (state, action) => {
            state.loading = false;
            state.allCoursesWithCoaches = action.payload.courses;
        });
        builder.addCase(getAllCoursesWithCoaches.rejected, (state, action) => {
            state.loading = false;
            state.allCoursesWithCoaches = [];
            state.error = action.payload || action.error.message;
        });

        //assign course to caoch
        builder.addCase(assignCourseToCoach.pending, state => {
            state.loading = true;
        });
        builder.addCase(assignCourseToCoach.fulfilled, (state, action) => {
            state.loading = false;
            toast.success(
                action.payload.message ||
                    'Courses Assigned To Coach Successfully'
            );
        });
        builder.addCase(assignCourseToCoach.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            toast.error(action.payload || 'Failed To Assign Courses To Coach');
        });

        // get all students
        builder.addCase(getCoachStudentBatchMapping.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            getCoachStudentBatchMapping.fulfilled,
            (state, action) => {
                state.loading = false;
                state.coachStudentBatchMapping = action.payload;
            }
        );
        builder.addCase(
            getCoachStudentBatchMapping.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            }
        );

        // get All batches

        builder.addCase(getCoachBatchMapping.pending, state => {
            state.loading = true;
        });
        builder.addCase(getCoachBatchMapping.fulfilled, (state, action) => {
            state.loading = false;
            state.coachBatchMapping = action.payload?.batches;
        });
        builder.addCase(getCoachBatchMapping.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });

        // Post Assign Students
        builder.addCase(postCoachAssignStudents.pending, state => {
            state.loading = true;
        });
        builder.addCase(postCoachAssignStudents.fulfilled, (state, action) => {
            state.loading = false;
            state.assignedStudents = action.payload;
            toast.success(
                action.payload.message ||
                    'Students Assigned To Coach Successfully'
            );
        });
        builder.addCase(postCoachAssignStudents.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            toast.error(action.payload || 'Failed To Assign Students To Coach');
        });

        // Post Assign Batches
        builder.addCase(postCoachAssignBatches.pending, state => {
            state.loading = true;
        });
        builder.addCase(postCoachAssignBatches.fulfilled, (state, action) => {
            state.loading = false;
            state.assignedBatches = action.payload;
            toast.success(
                action.payload.message ||
                    'Batches Assigned To Coach Successfully'
            );
        });
        builder.addCase(postCoachAssignBatches.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            toast.error(action.payload || 'Failed To Assign Batches To Coach');
        });

        // Toggle Assign Student Status
        builder.addCase(toggleCoachAssignStudentStatus.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            toggleCoachAssignStudentStatus.fulfilled,
            (state, action) => {
                state.loading = false;
                const updatedStudents = state.assignedStudents.map(student =>
                    student.id === action.payload.id
                        ? { ...student, is_active: action.payload.is_active }
                        : student
                );
                state.assignedStudents = updatedStudents;
                toast.success(
                    action.payload.message || 'Status Updated Successfully'
                );
            }
        );
        builder.addCase(
            toggleCoachAssignStudentStatus.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                toast.error(action.payload || 'Failed To Update Status');
            }
        );

        // Toggle Assign Batch Status
        builder.addCase(toggleCoachAssignBatchStatus.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            toggleCoachAssignBatchStatus.fulfilled,
            (state, action) => {
                state.loading = false;
                const updatedBatches = state.assignedBatches.map(batch =>
                    batch.id === action.payload.id
                        ? { ...batch, is_active: action.payload.is_active }
                        : batch
                );
                state.assignedBatches = updatedBatches;
                toast.success(
                    action.payload.message ||
                        'Updated Active Status Successfully'
                );
            }
        );
        builder.addCase(
            toggleCoachAssignBatchStatus.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
                toast.success(
                    action.payload || 'Failed To Update Active Status'
                );
            }
        );
    },
});

export const {
    openCreateCoach,
    closeCreateCoach,
    openEditCoach,
    closeEditCoach,
    setSelectedCoach,
    openCoachSuccessPopup,
    accessCoachName,
    closeCoachSuccessPopup,
    openCoachAssignStudents,
    closeCoachAssignStudents,
    openCoachAssignBatches,
    closeCoachAssignBatches,
} = coachSlice.actions;

export default coachSlice.reducer;
