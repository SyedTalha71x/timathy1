import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as relationApi from './relationApi';

export const createRelationThunk = createAsyncThunk('/relation/create', async (relationData, { rejectWithValue }) => {
    try {
        const res = await relationApi.createRelation(relationData)
        return res.relation;
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})


export const fetchAllRelationByIdz = createAsyncThunk('/relation/:id', async (id, { rejectWithValue }) => {
    try {
        const res = await relationApi.relationByIdz(id)
        return res.relation
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const fetchAllRelation = createAsyncThunk('/fetch/relation/all', async (_, { rejectWithValue }) => {
    try {
        const res = await relationApi.allRelation()
        return res.relation
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

const relationSlice = createSlice({
    name: 'relation',
    initialState: {
        relation: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createRelationThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(createRelationThunk.fulfilled, (state, action) => {
                state.loading = false
                state.relation = action.payload
            })
            .addCase(createRelationThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message
            })
            // all Relation
            .addCase(fetchAllRelation.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(fetchAllRelation.fulfilled, (state, action) => {
                state.loading = false
                state.relation = action.payload
            })
            .addCase(fetchAllRelation.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message
            })
            // fetch relation by idz
            .addCase(fetchAllRelationByIdz.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(fetchAllRelationByIdz.fulfilled, (state, action) => {
                state.loading = false
                state.relation = action.payload
            })
            .addCase(fetchAllRelationByIdz.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.message
            })
    }
})



export default relationSlice.reducer