import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import * as contractApi from './contractApi'


// *****
// Pause Reason Thunk
// **********

// create
export const createPauseReasonThunk = createAsyncThunk('/contract/reason/create-pause', async (data, { rejectWithValue }) => {
    try {
        const res = await contractApi.createPauseReasonApi(data)
        return res.reason
    } catch (error) {
        return rejectWithValue(error.res?.data)
    }
})
// get
export const fetchPauseReasonThunk = createAsyncThunk('/contract/reason/pauses', async (_, { rejectWithValue }) => {
    try {
        const res = await contractApi.fetchPauseReasonApi()
        return res.reasons
    } catch (error) {
        return rejectWithValue(error.res?.data)
    }
})
// update
export const updatePauseReasonThunk = createAsyncThunk('/contract/reason/update-pause', async ({ pauseId, updateData }, { rejectWithValue }) => {
    try {
        const res = await contractApi.updatePauseReasonApi(pauseId, updateData)
        return res.reason
    } catch (error) {
        return rejectWithValue(error.res?.data)
    }
})

// delete
export const deletePauseReasonThunk = createAsyncThunk('/contract/reason/delete-pause', async (pauseId, { rejectWithValue }) => {
    try {
        const res = await contractApi.deletePauseReasonApi(pauseId)
        return res.reason
    } catch (error) {
        return rejectWithValue(error.res?.data)
    }
})


// ******
// Renew Thunk
// ************

// create
export const createRenewReasonThunk = createAsyncThunk('/contract/reason/create-renew', async (data, { rejectWithValue }) => {
    try {
        const res = await contractApi.createRenewReasonApi(data)
        return res.reason
    } catch (error) {
        return rejectWithValue(error.res?.data)
    }
})
// update
export const updateRenewReasonThunk = createAsyncThunk('/contract/reason/update-renew', async ({ renewId, updateData }, { rejectWithValue }) => {
    try {
        const res = await contractApi.updateRenewReasonApi(renewId, updateData)
        return res.reason
    } catch (error) {
        return rejectWithValue(error.res?.data)
    }
})
// delete
export const deleteRenewReasonThunk = createAsyncThunk('/contract/reason/delete-renew', async (renewId, { rejectWithValue }) => {
    try {
        const res = await contractApi.deleteRenewReasonApi(renewId)
        return res.reason
    } catch (error) {
        return rejectWithValue(error.res?.data)
    }
})
// get
export const fetchRenewReasonThunk = createAsyncThunk('/contract/reason/renew', async (_, { rejectWithValue }) => {
    try {
        const res = await contractApi.fetchRenewReasonApi()
        return res.reasons
    } catch (error) {
        return rejectWithValue(error.res?.data)
    }
})

// ********
// Bonus Thunk
// *************

// create
export const createBonusReasonThunk = createAsyncThunk('/contract/reason/create-bonus', async (data, { rejectWithValue }) => {
    try {
        const res = await contractApi.createBonusReasonApi(data)
        return res.reason
    } catch (error) {
        return rejectWithValue(error.res?.data)
    }
})
// update
export const updateBonusReasonThunk = createAsyncThunk('/contract/reason/update-bonus', async ({ bonusId, updateData }, { rejectWithValue }) => {
    try {
        const res = await contractApi.updateBonusReasonApi(bonusId, updateData)
        return res.reason
    } catch (error) {
        return rejectWithValue(error.res?.data)
    }
})
// delete
export const deleteBonusReasonThunk = createAsyncThunk('/contract/reason/delete-bonus', async (bonusId, { rejectWithValue }) => {
    try {
        const res = await contractApi.deleteBonusReasonApi(bonusId)
        return res.reason
    } catch (error) {
        return rejectWithValue(error.res?.data)
    }
})
// get
export const fetchBonusReasonThunk = createAsyncThunk('/contract/reason/bonuses', async (_, { rejectWithValue }) => {
    try {
        const res = await contractApi.fetchBonusReasonApi()
        return res.reasons
    } catch (error) {
        return rejectWithValue(error.res?.data)
    }
})


// *******
// Changes Thunk
// ************

// create
export const createChangeReasonThunk = createAsyncThunk('/contract/reason/create-change', async (data, { rejectWithValue }) => {
    try {
        const res = await contractApi.createChangeReasonApi(data)
        return res.reason
    } catch (error) {
        return rejectWithValue(error.res?.data)
    }
})
// update
export const updateChangeReasonThunk = createAsyncThunk('/contract/reason/update-change', async ({ changeId, updateData }, { rejectWithValue }) => {
    try {
        const res = await contractApi.updateChangeReasonApi(changeId, updateData)
        return res.reason
    } catch (error) {
        return rejectWithValue(error.res?.data)
    }
})
// delete
export const deleteChangeReasonThunk = createAsyncThunk('/contract/reason/delete-change', async (changeId, { rejectWithValue }) => {
    try {
        const res = await contractApi.deleteChangeReasonApi(changeId)
        return res.reason
    } catch (error) {
        return rejectWithValue(error.res?.data)
    }
})

// get change Reason
export const fetchChangeReasonThunk = createAsyncThunk('/contract/reason/changes', async (_, { rejectWithValue }) => {
    try {
        const res = await contractApi.fetchChangeReasonApi()
        return res.reasons
    } catch (error) {
        return rejectWithValue(error.res?.data)
    }
})


// *********
// Contract Forms Templates Thunk
// **************

export const fetchContractFormThunk = createAsyncThunk('/contract/contractForm/fetch-forms', async (_, { rejectWithValue }) => {
    try {
        const res = await contractApi.getContractFormsApi()
        return res.forms
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})
export const createContractFormThunk = createAsyncThunk('/contract/contractForm/create-forms', async (data, { rejectWithValue }) => {
    try {
        const res = await contractApi.createContractFormApi(data)
        return res.form
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})
export const updateContractFormThunk = createAsyncThunk('/contract/contractForm/update-forms', async ({ formId, updateData }, { rejectWithValue }) => {
    try {
        const res = await contractApi.updateContractFormApi(formId, updateData)
        return res.form
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})
export const deleteContractFormThunk = createAsyncThunk('/contract/contractForm/delete-forms', async (formId, { rejectWithValue }) => {
    try {
        const res = await contractApi.deleteContractFormApi()
        return res.message
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})





const contractSlice = createSlice({
    name: 'contract',
    initialState: {
        contracts: [],
        pauseReasons: [],
        renewReasons: [],
        changeReasons: [],
        bonusReasons: [],
        contractForms: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // ========== PAUSE REASONS ==========
            // GET
            .addCase(fetchPauseReasonThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.pauseReasons = action.payload; // Should be an array
                state.error = null;
            })
            // CREATE
            .addCase(createPauseReasonThunk.fulfilled, (state, action) => {
                state.loading = false;
                // Add the new reason to the array
                state.pauseReasons.push(action.payload);
                state.error = null;
            })
            // UPDATE - FIX THIS ONE
            .addCase(updatePauseReasonThunk.fulfilled, (state, action) => {
                state.loading = false;
                // Find and replace the updated reason in the array
                const updatedReason = action.payload;
                const index = state.pauseReasons.findIndex(r => r._id === updatedReason._id);
                if (index !== -1) {
                    state.pauseReasons[index] = updatedReason;
                }
                state.error = null;
            })
            // DELETE - FIX THIS ONE
            .addCase(deletePauseReasonThunk.fulfilled, (state, action) => {
                state.loading = false;
                // Filter out the deleted reason
                const deletedId = action.payload?._id || action.payload;
                state.pauseReasons = state.pauseReasons.filter(r => r._id !== deletedId);
                state.error = null;
            })

            // ========== RENEW REASONS ==========
            .addCase(fetchRenewReasonThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.renewReasons = action.payload;
                state.error = null;
            })
            .addCase(createRenewReasonThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.renewReasons.push(action.payload);
                state.error = null;
            })
            .addCase(updateRenewReasonThunk.fulfilled, (state, action) => {
                state.loading = false;
                const updatedReason = action.payload;
                const index = state.renewReasons.findIndex(r => r._id === updatedReason._id);
                if (index !== -1) {
                    state.renewReasons[index] = updatedReason;
                }
                state.error = null;
            })
            .addCase(deleteRenewReasonThunk.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = action.payload?._id || action.payload;
                state.renewReasons = state.renewReasons.filter(r => r._id !== deletedId);
                state.error = null;
            })

            // ========== BONUS REASONS ==========
            .addCase(fetchBonusReasonThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.bonusReasons = action.payload;
                state.error = null;
            })
            .addCase(createBonusReasonThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.bonusReasons.push(action.payload);
                state.error = null;
            })
            .addCase(updateBonusReasonThunk.fulfilled, (state, action) => {
                state.loading = false;
                const updatedReason = action.payload;
                const index = state.bonusReasons.findIndex(r => r._id === updatedReason._id);
                if (index !== -1) {
                    state.bonusReasons[index] = updatedReason;
                }
                state.error = null;
            })
            .addCase(deleteBonusReasonThunk.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = action.payload?._id || action.payload;
                state.bonusReasons = state.bonusReasons.filter(r => r._id !== deletedId);
                state.error = null;
            })

            // ========== CHANGE REASONS ==========
            .addCase(fetchChangeReasonThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(fetchChangeReasonThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.changeReasons = action.payload;
                state.error = null;
            })
            .addCase(fetchChangeReasonThunk.rejected, (state, action) => {
                state.loading = true;
                state.error = action.payload?.message
            })
            // create
            .addCase(createChangeReasonThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(createChangeReasonThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.changeReasons.push(action.payload);
                state.error = null;
            })
            .addCase(createChangeReasonThunk.rejected, (state, action) => {
                state.loading = true;
                state.error = action.payload?.message
            })
            // update
            .addCase(updateChangeReasonThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(updateChangeReasonThunk.fulfilled, (state, action) => {
                state.loading = false;
                const updatedReason = action.payload;
                const index = state.changeReasons.findIndex(r => r._id === updatedReason._id);
                if (index !== -1) {
                    state.changeReasons[index] = updatedReason;
                }
                state.error = null;
            })
            .addCase(updateChangeReasonThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to create material'
            })
            .addCase(deleteChangeReasonThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(deleteChangeReasonThunk.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = action.payload?._id || action.payload;
                state.changeReasons = state.changeReasons.filter(r => r._id !== deletedId);
                state.error = null;
            })
            .addCase(deleteChangeReasonThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to create material'
            })

            // **********
            // Contract Forms Templates Slice
            // **************
            // GET ALL
            .addCase(fetchContractFormThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(fetchContractFormThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.contractForms = action.payload || [];  // Ensure it's always an array
                state.error = null
            })
            .addCase(fetchContractFormThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch materials'
            })

            // CREATE
            .addCase(createContractFormThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(createContractFormThunk.fulfilled, (state, action) => {
                state.loading = false;
                // Add the new material to the existing array
                if (action.payload) {
                    state.contractForms = [...state.contractForms, action.payload];
                }
                state.error = null
            })
            .addCase(createContractFormThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to create material'
            })

            // UPDATE
            .addCase(updateContractFormThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(updateContractFormThunk.fulfilled, (state, action) => {
                state.loading = false;
                // Replace the updated material in the array
                if (action.payload) {
                    const index = state.contractForms.findIndex(m => m._id === action.payload._id);
                    if (index !== -1) {
                        state.contractForms[index] = action.payload;
                    } else {
                        // If not found (shouldn't happen), add it
                        state.contractForms.push(action.payload);
                    }
                }
                state.error = null
            })
            .addCase(updateContractFormThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to update material'
            })

            // DELETE
            .addCase(deleteContractFormThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(deleteContractFormThunk.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the deleted material from the array
                const deletedId = action.payload.id;
                state.contractForms = state.contractForms.filter(m => m._id !== deletedId);
                state.error = null
            })
            .addCase(deleteContractFormThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to delete material'
            })
    }
})


export default contractSlice.reducer