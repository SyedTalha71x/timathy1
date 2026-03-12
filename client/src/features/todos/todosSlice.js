import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as todosApi from './todosApi'

// =======================
// All tags Thunks
// ======================

// create tags
export const createTagsThunk = createAsyncThunk('/tags/create', async (tagsData, { rejectWithValue }) => {
    try {
        const res = await todosApi.createTag(tagsData)
        return res.tags
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// get Tags
export const getTagsThunk = createAsyncThunk('/tags/all', async (_, { rejectWithValue }) => {
    try {
        const res = await todosApi.getTags();
        return res.tags
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// =======================
// all task Thunk
// ======================

// create Task
export const createTaskThunk = createAsyncThunk('/task/create', async (taskData, { rejectWithValue }) => {
    try {
        const res = await todosApi.createTask(taskData)
        return res.todos
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})
// get Tasks
export const getTaskThunk = createAsyncThunk('/task/all', async (_, { rejectWithValue }) => {
    try {
        const res = await todosApi.getTasks()
        return res.todos
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const deleteTagThunk = createAsyncThunk('/tags/delete', async () => {

})
export const deleteTaskThunk = createAsyncThunk('/task/delete', async () => {

})
export const updateTaskThunk = createAsyncThunk('/task/delete', async () => {

})

const taskSlice = createSlice({
    name: 'tasks',
    initialState: {
        tasks: [],
        tags: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // createTags
            .addCase(createTagsThunk.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(createTagsThunk.fulfilled, (state, action) => {
                state.loading = false,
                    state.tags = action.payload;
            })
            .addCase(createTagsThunk.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message
            })
            // get Tags
            .addCase(getTagsThunk.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(getTagsThunk.fulfilled, (state, action) => {
                state.loading = false,
                    state.tags = action.payload;
            })
            .addCase(getTagsThunk.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message
            })
            // =================
            // create task
            // ================= 

            .addCase(createTaskThunk.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(createTaskThunk.fulfilled, (state, action) => {
                state.loading = false,
                    state.tasks = action.payload;
            })
            .addCase(createTaskThunk.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message
            })
            // get Tasks
            .addCase(getTaskThunk.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(getTaskThunk.fulfilled, (state, action) => {
                state.loading = false,
                    state.tasks = action.payload;
            })
            .addCase(getTaskThunk.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.message
            })
    }
})


export default taskSlice.reducer