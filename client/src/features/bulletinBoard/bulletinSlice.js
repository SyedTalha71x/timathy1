import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as bulletinApi from './bulletinApi'

export const getAllPostThunk = createAsyncThunk('/post/get-post', async (_, { rejectWithValue }) => {
    try {
        const res = await bulletinApi.getAllPostApi()
        return res.posts
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const createPostThunk = createAsyncThunk('/post/create', async (data, { rejectWithValue }) => {
    try {
        const res = await bulletinApi.createPostApi(data)
        return res.post
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const updatePostThunk = createAsyncThunk('/post/update-post', async ({ postId, updateData }, { rejectWithValue }) => {
    try {
        const res = await bulletinApi.updatePostApi(postId, updateData)
        return { post: res.post, postId }
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const deletePostThunk = createAsyncThunk('/post/delete-post', async (postId, { rejectWithValue }) => {
    try {
        const res = await bulletinApi.deletePostApi(postId)
        return { message: res.message, postId }
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const activePostThunk = createAsyncThunk('/post/active-post', async (postId, { rejectWithValue }) => {
    try {
        const res = await bulletinApi.activePostApi(postId)
        return { post: res.post, postId }
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const deActivatedPostThunk = createAsyncThunk('/post/in-active-post', async (postId, { rejectWithValue }) => {
    try {
        const res = await bulletinApi.deActivePostApi(postId)
        return { post: res.post, postId }
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

const postSlice = createSlice({
    name: 'post',
    initialState: {
        posts: [],
        loading: false,
        error: null,
        selectedPost: null,
        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: 10
        }
    },
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        clearPosts: (state) => {
            state.posts = []
            state.selectedPost = null
        },
        setSelectedPost: (state, action) => {
            state.selectedPost = action.payload
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload }
        }
    },
    extraReducers: (builder) => {
        builder
            // Get All Posts
            .addCase(getAllPostThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getAllPostThunk.fulfilled, (state, action) => {
                state.loading = false
                state.posts = action.payload
                state.error = null
            })
            .addCase(getAllPostThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || action.error.message
            })
            
            // Create Post
            .addCase(createPostThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createPostThunk.fulfilled, (state, action) => {
                state.loading = false
                state.posts.unshift(action.payload) // Add to beginning of array
                state.error = null
            })
            .addCase(createPostThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || action.error.message
            })
            
            // Update Post
            .addCase(updatePostThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updatePostThunk.fulfilled, (state, action) => {
                state.loading = false
                const index = state.posts.findIndex(post => post._id === action.payload.postId)
                if (index !== -1) {
                    state.posts[index] = action.payload.post
                }
                if (state.selectedPost?._id === action.payload.postId) {
                    state.selectedPost = action.payload.post
                }
                state.error = null
            })
            .addCase(updatePostThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || action.error.message
            })
            
            // Delete Post
            .addCase(deletePostThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deletePostThunk.fulfilled, (state, action) => {
                state.loading = false
                state.posts = state.posts.filter(post => post._id !== action.payload.postId)
                if (state.selectedPost?._id === action.payload.postId) {
                    state.selectedPost = null
                }
                state.error = null
            })
            .addCase(deletePostThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || action.error.message
            })
            
            // Active Post
            .addCase(activePostThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(activePostThunk.fulfilled, (state, action) => {
                state.loading = false
                const index = state.posts.findIndex(post => post._id === action.payload.postId)
                if (index !== -1) {
                    state.posts[index] = action.payload.post
                }
                if (state.selectedPost?._id === action.payload.postId) {
                    state.selectedPost = action.payload.post
                }
                state.error = null
            })
            .addCase(activePostThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || action.error.message
            })
            
            // Deactivate Post
            .addCase(deActivatedPostThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deActivatedPostThunk.fulfilled, (state, action) => {
                state.loading = false
                const index = state.posts.findIndex(post => post._id === action.payload.postId)
                if (index !== -1) {
                    state.posts[index] = action.payload.post
                }
                if (state.selectedPost?._id === action.payload.postId) {
                    state.selectedPost = action.payload.post
                }
                state.error = null
            })
            .addCase(deActivatedPostThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || action.error.message
            })
    }
})

export const { clearError, clearPosts, setSelectedPost, setPagination } = postSlice.actions
export default postSlice.reducer