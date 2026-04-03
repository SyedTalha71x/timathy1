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








const contractSlice = createSlice({
    name: 'contract',
    initialState: {
        contracts: [],
        pauseReasons: [],
        renewReasons: [],
        changeReasons: [],
        bonusReasons: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // ********
            // Pause Slice
            // ************

            // get
            .addCase(fetchPauseReasonThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(fetchPauseReasonThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.pauseReasons = action.payload;
                state.error = null
            })
            .addCase(fetchPauseReasonThunk.rejected, (state, action) => {
                state.loading = true;
                state.error = action.payload?.message
            })
            // create
            .addCase(createPauseReasonThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(createPauseReasonThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.pauseReasons = action.payload;
                state.error = null
            })
            .addCase(createPauseReasonThunk.rejected, (state, action) => {
                state.loading = true;
                state.error = action.payload?.message
            })
            // update
            .addCase(updatePauseReasonThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(updatePauseReasonThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.pauseReasons = action.payload;
                state.error = null
            })
            .addCase(updatePauseReasonThunk.rejected, (state, action) => {
                state.loading = true;
                state.error = action.payload?.message
            })
            // delete
            .addCase(deletePauseReasonThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(deletePauseReasonThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.pauseReasons = action.payload;
                state.error = null
            })
            .addCase(deletePauseReasonThunk.rejected, (state, action) => {
                state.loading = true;
                state.error = action.payload?.message
            })
            // ********
            // Renew Slice
            // ************

            // get
            .addCase(fetchRenewReasonThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(fetchRenewReasonThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.renewReasons = action.payload;
                state.error = null
            })
            .addCase(fetchRenewReasonThunk.rejected, (state, action) => {
                state.loading = true;
                state.error = action.payload?.message
            })
            // create
            .addCase(createRenewReasonThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(createRenewReasonThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.renewReasons = action.payload;
                state.error = null
            })
            .addCase(createRenewReasonThunk.rejected, (state, action) => {
                state.loading = true;
                state.error = action.payload?.message
            })
            // update
            .addCase(updateRenewReasonThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(updateRenewReasonThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.renewReasons = action.payload;
                state.error = null
            })
            .addCase(updateRenewReasonThunk.rejected, (state, action) => {
                state.loading = true;
                state.error = action.payload?.message
            })
            // delete
            .addCase(deleteRenewReasonThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(deleteRenewReasonThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.renewReasons = action.payload;
                state.error = null
            })
            .addCase(deleteRenewReasonThunk.rejected, (state, action) => {
                state.loading = true;
                state.error = action.payload?.message
            })
            // ********
            // Bonus Slice
            // ************

            // get
            .addCase(fetchBonusReasonThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(fetchBonusReasonThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.bonusReasons = action.payload;
                state.error = null
            })
            .addCase(fetchBonusReasonThunk.rejected, (state, action) => {
                state.loading = true;
                state.error = action.payload?.message
            })
            // create
            .addCase(createBonusReasonThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(createBonusReasonThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.bonusReasons = action.payload;
                state.error = null
            })
            .addCase(createBonusReasonThunk.rejected, (state, action) => {
                state.loading = true;
                state.error = action.payload?.message
            })
            // update
            .addCase(updateBonusReasonThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(updateBonusReasonThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.bonusReasons = action.payload;
                state.error = null
            })
            .addCase(updateBonusReasonThunk.rejected, (state, action) => {
                state.loading = true;
                state.error = action.payload?.message
            })
            // delete
            .addCase(deleteBonusReasonThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(deleteBonusReasonThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.bonusReasons = action.payload;
                state.error = null
            })
            .addCase(deleteBonusReasonThunk.rejected, (state, action) => {
                state.loading = true;
                state.error = action.payload?.message
            })
            // ********
            // Change Slice
            // ************

            // get
            .addCase(fetchChangeReasonThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(fetchChangeReasonThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.changeReasons = action.payload;
                state.error = null
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
                state.changeReasons = action.payload;
                state.error = null
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
                state.changeReasons = action.payload;
                state.error = null
            })
            .addCase(updateChangeReasonThunk.rejected, (state, action) => {
                state.loading = true;
                state.error = action.payload?.message
            })
            // delete
            .addCase(deleteChangeReasonThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(deleteChangeReasonThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.changeReasons = action.payload;
                state.error = null
            })
            .addCase(deleteChangeReasonThunk.rejected, (state, action) => {
                state.loading = true;
                state.error = action.payload?.message
            })
    }
})


export default contractSlice.reducer