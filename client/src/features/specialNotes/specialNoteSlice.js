import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as specialNoteApi from './specialNoteApi'



export const createNoteThunk = createAsyncThunk('/special/note/create', async (noteData, { rejectWithValue }) => {
    try {
        const res = await specialNoteApi.createNote(noteData)
        return res.notes;
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})
export const fetchNotesByIdzThunk = createAsyncThunk('/special/note/:id', async (id, { rejectWithValue }) => {
    try {
        const res = await specialNoteApi.specialNoteByIdz(id)
        return res.notes;
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})
export const fetchAllSpecialNotes = createAsyncThunk('/special/note/all', async (_, { rejectWithValue }) => {
    try {
        const res = await specialNoteApi.specialNotes()
        return res.notes;
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})




const specialNoteSlice = createSlice({
    name: 'special',
    initialState: {
        specials: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createNoteThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(createNoteThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.specials = action.payload
            })
            .addCase(createNoteThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            .addCase(fetchNotesByIdzThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(fetchNotesByIdzThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.specials = action.payload
            })
            .addCase(fetchNotesByIdzThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            .addCase(fetchAllSpecialNotes.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(fetchAllSpecialNotes.fulfilled, (state, action) => {
                state.loading = false;
                state.specials = action.payload
            })
            .addCase(fetchAllSpecialNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
    }
})


export default specialNoteSlice.reducer