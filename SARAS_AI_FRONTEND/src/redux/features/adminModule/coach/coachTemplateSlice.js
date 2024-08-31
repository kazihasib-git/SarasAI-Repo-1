import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { baseUrl } from '../../../../utils/baseURL';
import axiosInstance from '../../../services/httpService';
import { toast } from 'react-toastify';

export const getAllCoachTemplates = createAsyncThunk(
    'coachTemplate/getAllCoachTemplates',
    async () => {
        const response = await axiosInstance.get(
            `${baseUrl}/admin/coaching-templates`
        );
        return response.data;
    }
);

export const createCoachTemplate = createAsyncThunk(
    'coachTemplate/createCoachTemplate',
    async (data, { rejectWithValue }) => {
        try{
        const response = await axiosInstance.post(
            `${baseUrl}/admin/store-template`,
            data
        );
        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data.message);
        } else {
            return rejectWithValue(
                'An Error Occurred While Creating Template'
            );
        }
    }
}
);

export const getAllCoachTemplateModules = createAsyncThunk(
    'coachTemplate/getAllCoachTemplateModules',
    async templateId => {
        const response = await axiosInstance.get(
            `${baseUrl}/admin/coaching-templates/modules/${templateId}`
        );
        const modules = response.data.data.filter(
            module => module.template_id === templateId
        );
        return modules;
    }
);

export const createCoachTemplateModule = createAsyncThunk(
    'coachTemplate/createCoachTemplateModule',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/admin/coaching-templates/store-modules`,
                data
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Creating Module'
                );
            }
        }
    }
);

export const getCoachTemplateModuleId = createAsyncThunk(
    'coachTemplate/getCoachTemplateModuleId',
    async id => {
        const response = await axiosInstance.get(
            `${baseUrl}/admin/coaching-templates/modules/${id}`
        );
        return response.data;
    }
);

export const updateCoachTemplateModule = createAsyncThunk(
    'coachTemplate/updateCoachTemplateModule',
    async (data, { rejectWithValue }) => {
        try{
        const response = await axiosInstance.post(
            `${baseUrl}/admin/coaching-templates/update-modules`,
            data
        );
        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data.message);
        } else {
            return rejectWithValue(
                'An Error Occurred While Updating activity'
            );
        }
    }
}
);

export const updateTemplateActivity = createAsyncThunk(
    'coachTemplate/updateTemplateActivity',
    async ({ data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/admin/coaching-templates/template-status`,
                data
            );
            console.log('API Response: ', response.data);
            return response.data;
        } catch (error) {
            console.error(
                'API Error: ',
                error.response ? error.response.data : error.message
            );  
            return rejectWithValue(
                error.response ? error.response.data : error.message
            );
        }
    }
);
export const updateModuleActivity = createAsyncThunk(
    'coachTemplate/updateModuleActivity',
    async ({ data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/admin/coaching-templates/activity-status`,
                data
            );
            console.log('API Response: ', response.data);
            return response.data;
        } catch (error) {
            console.error(
                'API Error: ',
                error.response ? error.response.data : error.message
            );  
            return rejectWithValue(
                error.response ? error.response.data : error.message
            );
        }
    }
);

export const createCoachTemplateActivity = createAsyncThunk(
    'coachTemplate/createCoachTemplateActivity',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/admin/coaching-templates/store-activity`,
                data
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While creating activity'
                );
            }
        }
    }
);

export const updateEditActivity = createAsyncThunk(
    'coachTemplate/updateEditActivity',
    async ({ data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/admin/coaching-templates/update-activity`,
                data
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Updating activity'
                );
            }
        }
    }
);

// add prerequisites to the activity

export const addPrerequisites = createAsyncThunk(
    'coachTemplate/addPrerequisites',
    async (data, { rejectWithValue }) => {
        try{
        const response = await axiosInstance.post(
            `${baseUrl}/admin/coaching-templates/activity-prerequisite`,
            data
        );
        return response.data;
    }
    catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data.message);
        } else {
            return rejectWithValue(
                'An Error Occurred While Updating activity'
            );
        }
    }
}
);

// assign students to template

export const assignStudentsToTemplate = createAsyncThunk(
    'coachTemplate/addPrerequisites',
    async data => {
        const response = await axiosInstance.post(
            `${baseUrl}/admin/coaching-templates/template-assign`,
            data
        );
        return response.data;
    }
);

export const getStudentBatchMapping = createAsyncThunk(
    'coachTemplate/getStudentBatchMapping',
    async () => {
        const response = await axiosInstance.get(
            `${baseUrl}/admin/student-batch-mapping/getAllStudentWithBatches`
        );
        console.log('Response : ', response);
        return response.data;
    }
);

export const getBatchMapping = createAsyncThunk(
    'coachTemplate/getBatchMapping',
    async () => {
        const response = await axiosInstance.get(`${baseUrl}/admin/batches`);
        return response.data;
    }
);

export const getStudentsWithBatch = createAsyncThunk(
    'coachTemplate/getStudentsWithBatch',
    async id => {
        const response = await axiosInstance.get(
            `${baseUrl}/admin/student-batch-mapping/students/${id}`
        );
        return response.data;
    }
);

const initialState = {
    coachesTemplateList: [],
    coachTemplates: [],
    coachTemplatesId: [],
    moduleID: null,
    editModuleData: null,
    editActivityData: null,
    loading: false,
    error: null,
    createCoachTemplateOpen: false,
    editCoachTemplateOpen: false,
    selectedCoachTemplate: null,
    selectedModule: null,
    openModulePopUp: false,
    openActivityPopUp: false,
    openEditModulePopUp: false,
    openEditActivityPopUp: false,
    assignStudentOpen: false,
    assignBatchOpen: false,
    template_name: null,
    templateId: null,
    createCoachTemplateOpen: false,
    editCoachTemplateOpen: false,
    createCoachModule: null,
    modulesData: [],
    newlyCreateTemplate: null,

    assignStudentsToTemplate: false,
    templateIdToAssignStudents: null,
    studentBatchMapping: [],
    batchMapping: [],

    assignBatchesToTemplate: false,
    templateIdToAssignBatches: null,
};

export const coachTemplateSlice = createSlice({
    name: 'coachTemplate',
    initialState,
    reducers: {
        accessCoachTemplateName(state, action) {
            //   console.log("ACTION : ", action);
            console.log('ACTION PAYLOAD : ', action.payload);
            // state.template_name = action.payload.name;
            state.templateId = action.payload.id;
        },
        setSelectedCoachTemplate(state, action) {
            state.selectedCoachTemplate = action.payload;
        },
        removeSelectedCoachTemplate(state) {
            state.selectedCoachTemplate = null;
        },
        setSelectedModule(state, action) {
            state.selectedModule = action.payload;
        },
        removeSelectedModule(state) {
            state.selectedModule = null;
        },
        openCreateTemplateCoach(state) {
            state.createCoachTemplateOpen = true;
        },
        closeCreateTemplateCoach(state) {
            state.createCoachTemplateOpen = false;
        },
        openEditTemplateCoach(state) {
            console.log('CLICKED !');
            state.editCoachTemplateOpen = true;
        },
        closeEditTemplateCoach(state) {
            state.editCoachTemplateOpen = false;
        },
        openTemplateModulePopup(state) {
            state.openModulePopUp = true;
        },
        closeTemplateModulePopup(state) {
            state.openModulePopUp = false;
        },
        openTemplateActivityPopup(state, action) {
            state.openActivityPopUp = true;
            console.log('Action payload : ', action.payload);
            state.moduleID = action.payload;
        },
        closeTemplateActivityPopup(state) {
            state.openActivityPopUp = false;
        },
        openEditModulePopup(state, action) {
            state.openEditModulePopUp = true;
            console.log('EDIT MODULE DATA  : ', action.payload);
            state.editModuleData = action.payload;
        },
        closeEditModulePopup(state) {
            state.openEditModulePopUp = false;
        },
        openEditActivityPopup(state, action) {
            state.openEditActivityPopUp = true;
            console.log('EDIT Activity DATA  : ', action.payload);
            state.editActivityData = action.payload;
        },
        closeEditActivityPopup(state) {
            state.openEditActivityPopUp = false;
        },

        // open assignstudents to coach template
        openAssignStudentsToTemplate(state, action) {
            (state.assignStudentsToTemplate = true),
                (state.templateIdToAssignStudents = action.payload);
        },
        closeAssignStudentsToTemplate(state) {
            (state.assignStudentsToTemplate = false),
                (state.templateIdToAssignStudents = null);
        },

        // open assignbatches to coach template
        openAssignBatchesToTemplate(state, action) {
            (state.assignBatchesToTemplate = true),
                (state.templateIdToAssignBatches = action.payload);
        },
        closeAssignBatchesToTemplate(state) {
            (state.assignBatchesToTemplate = false),
                (state.templateIdToAssignBatches = null);
        },
    },
    extraReducers: builder => {
        // getAllCoachTemplates
        builder
            .addCase(getAllCoachTemplates.pending, state => {
                state.loading = true;
            })
            .addCase(getAllCoachTemplates.fulfilled, (state, action) => {
                console.log('ACTION  getAllCOachTemplate: ', action.payload);
                state.loading = false;
                state.coachTemplates = action.payload.data;
            })
            .addCase(getAllCoachTemplates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        // createCoachTemplate
        builder
            .addCase(createCoachTemplate.pending, state => {
                state.loading = true;
            })
            .addCase(createCoachTemplate.fulfilled, (state, action) => {
                console.log('action .payload', action.payload);
                state.loading = false;
                state.coachTemplates.push(action.payload.data);
                state.selectedCoachTemplate = action.payload.data.id;
                // state.template_name = action.payload.data.name;
                toast.success(
                    action.payload.message ||
                        'Coach Template has been successfully created.'
                );
            })
            .addCase(createCoachTemplate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                toast.error(action.payload || 'failed to create coach template');
            });

        // getAllCoachTemplateModules
        builder
            .addCase(getAllCoachTemplateModules.pending, state => {
                state.loading = true;
            })
            .addCase(getAllCoachTemplateModules.fulfilled, (state, action) => {
                state.loading = false;
                console.log('MODULE DATA  : ', action.payload);
                state.modulesData = action.payload?.data;
            })
            .addCase(getAllCoachTemplateModules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        // createCoachTemplateModule
        builder
            .addCase(createCoachTemplateModule.pending, state => {
                state.loading = true;
            })
            .addCase(createCoachTemplateModule.fulfilled, (state, action) => {
                console.log('ACTION CreateCoachTemplate : ', action.payload);
                state.loading = false;
                state.createCoachModule = action.payload.data;
                toast.success(
                    action.payload.message ||
                        'Leave request has been successfully created.'
                );
            })
            .addCase(createCoachTemplateModule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                toast.error(action.payload || 'Failed To Mark Leave');
            });

        // getCoachTemplateModuleId
        builder
            .addCase(getCoachTemplateModuleId.pending, state => {
                state.loading = true;
            })
            .addCase(getCoachTemplateModuleId.fulfilled, (state, action) => {
                console.log('ACtion playlod', action.payload);
                state.loading = false;
                state.coachTemplatesId = action.payload.data;
                state.template_name = action.payload.data.name;
            })
            .addCase(getCoachTemplateModuleId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        // updateCoachTemplateModule
        builder
            .addCase(updateCoachTemplateModule.pending, state => {
                state.loading = true;
            })
            .addCase(updateCoachTemplateModule.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.coachTemplates.findIndex(
                    coachTemplate => coachTemplate.id === action.payload.id
                );
                if (index !== -1) {
                    state.coachTemplates[index] = action.payload;
                }
                toast.success(
                    action.payload.message ||
                        'Leave request has been successfully created.'
                );
            })
            .addCase(updateCoachTemplateModule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                toast.error(action.payload || 'Failed To Mark Leave');
            });

        // Update Coach Activity
        builder
            .addCase(updateTemplateActivity.pending, state => {
                state.loading = true;
            })
            .addCase(updateTemplateActivity.fulfilled, (state, action) => {
                state.loading = false;
                // state.coachTemplates.push(action.payload.data);
            })
            .addCase(updateTemplateActivity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

            //update module acativity 
        builder
            .addCase(updateModuleActivity.pending, state => {
                state.loading = true;
            })
            .addCase(updateModuleActivity.fulfilled, (state, action) => {
                state.loading = false;
                // state.coachTemplates.push(action.payload.data);
            })
            .addCase(updateModuleActivity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        // Update Coach edit Activity
        builder
            .addCase(updateEditActivity.pending, state => {
                state.loading = true;
            })
            .addCase(updateEditActivity.fulfilled, (state, action) => {
                state.loading = false; 
                // state.coachTemplates.push(action.payload.data);
                state.editActivityData = action.payload?.data;
                toast.success(
                    action.payload.message || 'Activity Updated Succesfully'
                );
            })
            .addCase(updateEditActivity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                toast.error(action.payload || 'Failed to update Activity');
            });

        // createCoachTemplateActivity 
        builder
            .addCase(createCoachTemplateActivity.pending, state => {
                state.loading = true;
            })
            .addCase(createCoachTemplateActivity.fulfilled, (state, action) => {
                state.loading = false;
                state.coachTemplates.push(action.payload.data);
                toast.success(
                    action.payload.message ||
                        'Leave request has been successfully created.'
                );
            })
            .addCase(createCoachTemplateActivity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                toast.error(action.payload || 'Failed To Mark Leave');
            });

        // addPrerequisites
        builder
            .addCase(addPrerequisites.pending, state => {
                state.loading = true;
            })
            .addCase(addPrerequisites.fulfilled, (state, action) => {
                state.loading = false;
                // state.coachTemplates.push(action.payload.data);
                toast.success(
                    action.payload.message ||
                        'Succesfully Created '
                );
            })
            .addCase(addPrerequisites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                toast.error(action.payload || 'Failed to Addprerequisites');
            });

        // Get Student-Batch Mapping
        builder.addCase(getStudentBatchMapping.pending, state => {
            state.loading = true;
        });
        builder.addCase(getStudentBatchMapping.fulfilled, (state, action) => {
            state.loading = false;
            // console.log("MAPPING PAYLOAD :", action.payload )
            state.studentBatchMapping = action.payload;
        });
        builder.addCase(getStudentBatchMapping.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });

        // get batch mapping
        builder.addCase(getBatchMapping.pending, state => {
            state.loading = true;
        });
        builder.addCase(getBatchMapping.fulfilled, (state, action) => {
            state.loading = false;
            state.batchMapping = action.payload.batches;
        });
        builder.addCase(getBatchMapping.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });
    },
});

export const {
    setSelectedCoachTemplate,
    removeSelectedCoachTemplate,
    setSelectedModule,
    removeSelectedModule,
    openCreateTemplateCoach,
    closeCreateTemplateCoach,
    openEditTemplateCoach,
    closeEditTemplateCoach,
    accessCoachTemplateName,
    openTemplateModulePopup,
    closeTemplateModulePopup,
    openTemplateActivityPopup,
    closeTemplateActivityPopup,
    openEditModulePopup,
    closeEditModulePopup,
    openEditActivityPopup,
    closeEditActivityPopup,
    openAssignStudentsToTemplate,
    closeAssignStudentsToTemplate,
    openAssignBatchesToTemplate,
    closeAssignBatchesToTemplate,
} = coachTemplateSlice.actions;

export default coachTemplateSlice.reducer;
