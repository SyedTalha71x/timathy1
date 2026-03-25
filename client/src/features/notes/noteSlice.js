import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as noteApi from './noteApi'

// =====
// create Studio Notes thunks
// =========
export const createStudioNotesThunk = createAsyncThunk('/notes/create/create-studio-notes', async (noteData, { rejectWithValue }) => {
    try {
        const res = await noteApi.createNoteForStudio(noteData)
        console.log('res', res.notes)
        return res.notes
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// =====
//  Get Studio Notes thunks
// =========
export const getStudioNotesThunk = createAsyncThunk('/notes/get/all-studio-notes', async (_, { rejectWithValue }) => {
    try {
        const res = await noteApi.getNotesOfStudio();
        return res.notes
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// =====
// create personal notes thunks
// =========
export const createPersonalNotesThunk = createAsyncThunk('/notes/create/create-personal-notes', async (noteData, { rejectWithValue }) => {
    try {
        const res = await noteApi.createNote(noteData)
        return res.notes
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// =====
//  Get Personal Notes thunks
// =========
export const getPersonalNotesThunk = createAsyncThunk('/notes/get/all-personal-notes', async (_, { rejectWithValue }) => {
    try {
        const res = await noteApi.getNotes();
        return res.notes
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// =====
// updates Notes Thunks
// ========
export const updateNoteThunk = createAsyncThunk('/notes/update-note', async ({ noteId, updateData }, { rejectWithValue }) => {
    try {
        const res = await noteApi.updateNotes(noteId, updateData);
        // Assume res.notes contains the updated note
        if (!res || !res.notes) {
            throw new Error('Invalid response from server');
        }
        return res.notes;
    } catch (error) {
        // If status is 304, treat as success (no changes)
        if (error.response && error.response.status === 304) {
            // Return the current note data (you may need to fetch it or get from state)
            // Since we don't have it here, we'll just return a dummy success object
            return { _id: noteId, ...updateData };
        }
        return rejectWithValue(error.response?.data || { message: error.message });
    }
});

// =====
// Delete Notes Thunks - FIXED THE PATH
// ========
export const deleteNoteThunk = createAsyncThunk('/notes/delete-note', async (noteId, { rejectWithValue }) => {
    try {
        const res = await noteApi.deleteNote(noteId)
        return { noteId, message: res.message }; // Return object with noteId
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

const noteSlice = createSlice({
    name: 'notes',
    initialState: {
        personalNotes: [], // Renamed from 'notes' to 'personalNotes' for clarity
        studioNotes: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // =======
            // create studio notes slice
            // ===========
            .addCase(createStudioNotesThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(createStudioNotesThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.studioNotes = [action.payload, ...state.studioNotes];
            })
            .addCase(createStudioNotesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })

            // =======
            // create personal notes slice
            // ===========
            .addCase(createPersonalNotesThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(createPersonalNotesThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.personalNotes = [action.payload, ...state.personalNotes];
            })
            .addCase(createPersonalNotesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })

            // =======
            // get Studio Notes Slice
            // ==========
            .addCase(getStudioNotesThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(getStudioNotesThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.studioNotes = action.payload;
            })
            .addCase(getStudioNotesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })

            // =======
            // get Personal Notes Slice
            // ==========
            .addCase(getPersonalNotesThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(getPersonalNotesThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.personalNotes = action.payload;
            })
            .addCase(getPersonalNotesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })

            // =====
            // update notes - NOW WORKS FOR BOTH ARRAYS
            // ========
            .addCase(updateNoteThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(updateNoteThunk.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload && action.payload._id) {
                    // Try to update in personalNotes
                    const personalIndex = state.personalNotes.findIndex(n => n._id === action.payload._id);
                    if (personalIndex !== -1) {
                        state.personalNotes[personalIndex] = action.payload;
                    }

                    // Try to update in studioNotes
                    const studioIndex = state.studioNotes.findIndex(n => n._id === action.payload._id);
                    if (studioIndex !== -1) {
                        state.studioNotes[studioIndex] = action.payload;
                    }
                }
            })
            .addCase(updateNoteThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })

            // =====
            // Delete Note Slice - NOW WORKS FOR BOTH ARRAYS
            // ==========
            .addCase(deleteNoteThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(deleteNoteThunk.fulfilled, (state, action) => {
                state.loading = false;
                const { noteId } = action.payload; // Get noteId from the returned object

                // Remove from personalNotes
                state.personalNotes = state.personalNotes.filter(n => n._id !== noteId);

                // Remove from studioNotes
                state.studioNotes = state.studioNotes.filter(n => n._id !== noteId);
            })
            .addCase(deleteNoteThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
    }
})

export default noteSlice.reducer;