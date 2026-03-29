import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as medicalHistoryApi from './medicalHistoryApi'


export const createFormThunk = createAsyncThunk('/medical/create-form', async (mediData, { rejectWithValue }) => {
    try {
        const res = await medicalHistoryApi.createMedical(mediData)
        return res.form
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const getAllFormThunk = createAsyncThunk('/medical/all-forms', async (_, { rejectWithValue }) => {
    try {
        const res = await medicalHistoryApi.getAllForms();
        return res.forms
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// toggle form active and inactive

export const toggleActiveThunk = createAsyncThunk('/medical/toggle-active', async (id, { rejectWithValue }) => {
    try {
        const res = await medicalHistoryApi.toggleActive(id);
        return res.form
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// update Form
export const updateFormThunk = createAsyncThunk('/medical/update-form', async ({ id, updateData }, { rejectWithValue }) => {
    try {
        const res = await medicalHistoryApi.updateForm(id, updateData);
        return res.form
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// delete form
export const deleteFormThunk = createAsyncThunk('/medical/delete-form', async (id, { rejectWithValue }) => {
    try {
        const res = await medicalHistoryApi.deleteForm(id);
        return res.message
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})


// +++++++++++++++
// Medical History Response Form Thunks
// +++++++++++++++

export const createResponseThunk = createAsyncThunk('/history/create-response', async ({ entityType, entityId, responseData }, { rejectWithValue }) => {
    try {
        const res = await medicalHistoryApi.createResponse(entityType, entityId, responseData);
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
})

export const getResponsesByEntityThunk = createAsyncThunk('/history/get-responses-by-entity', async ({ entityType, entityId }, { rejectWithValue }) => {
    try {
        const res = await medicalHistoryApi.getResponsesByEntity(entityType, entityId);
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
})

export const getResponseByIdThunk = createAsyncThunk('/history/get-response-by-id', async (responseId, { rejectWithValue }) => {
    try {
        const res = await medicalHistoryApi.getResponseById(responseId);
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
})

export const updateResponseThunk = createAsyncThunk('/history/update-response', async ({ responseId, updateData }, { rejectWithValue }) => {
    try {
        const res = await medicalHistoryApi.updateResponse(responseId, updateData);
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
})

export const deleteResponseThunk = createAsyncThunk('/history/delete-response', async (responseId, { rejectWithValue }) => {
    try {
        const res = await medicalHistoryApi.deleteResponse(responseId);
        return res.message;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
})

export const generateResponsePDFThunk = createAsyncThunk('/history/generate-response-pdf', async (responseId, { rejectWithValue }) => {
    try {
        const res = await medicalHistoryApi.generateResponsePDF(responseId);
        return res.pdfUrl;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
})





const medicalSlice = createSlice({
    name: 'medical',
    initialState: {
        medical: [],
        history: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            // create medical Forms
            .addCase(createFormThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(createFormThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.medical = action.payload
            })
            .addCase(createFormThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })

            // All medical Forms
            .addCase(getAllFormThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(getAllFormThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.medical = action.payload
            })
            .addCase(getAllFormThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            // Toggle medical Forms
            .addCase(toggleActiveThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(toggleActiveThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.medical = action.payload
            })
            .addCase(toggleActiveThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            // +++++++++++++++++
            // Medical Response Slice
            // +++++++++++++++++++

            // Create Response
            .addCase(createResponseThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createResponseThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.history.push(action.payload);
            })
            .addCase(createResponseThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            // get responses by entity
            .addCase(getResponsesByEntityThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getResponsesByEntityThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.history = action.payload;
            })
            .addCase(getResponsesByEntityThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            // get a response by id
            .addCase(getResponseByIdThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getResponseByIdThunk.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.history.findIndex(r => r._id === action.payload._id);
                if (index !== -1) {
                    state.history[index] = action.payload;
                } else {
                    state.history.push(action.payload);
                }
            })
            .addCase(getResponseByIdThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })
            // update a response
            .addCase(updateResponseThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateResponseThunk.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.history.findIndex(r => r._id === action.payload._id);
                if (index !== -1) {
                    state.history[index] = action.payload;
                }
            })
            .addCase(updateResponseThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            // Delete a response
            .addCase(deleteResponseThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteResponseThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.history = state.history.filter(r => r._id !== action.payload._id);
            })
            .addCase(deleteResponseThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            // Generate PDF for a response
            .addCase(generateResponsePDFThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(generateResponsePDFThunk.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.history.findIndex(r => r._id === action.payload._id);
                if (index !== -1) {
                    state.history[index].pdfUrl = action.payload.pdfUrl;
                }
            })
            .addCase(generateResponsePDFThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            });

    }
})

export default medicalSlice.reducer