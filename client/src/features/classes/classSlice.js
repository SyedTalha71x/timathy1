import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as classApi from './classApi'

// &&&&&&&&&&&&&&
//  ALL CATEGORIES THUNKS
// &&&&&&&&&&&&&&&&&&&

// &&& Create Category &&&
export const createCategoryThunk = createAsyncThunk('/category/create-category', async (data, { rejectWithValue }) => {
    try {
        const res = await classApi.createCategoryApi(data)
        return res.category
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// &&& Get Categories &&&
export const getCategoriesThunk = createAsyncThunk('/category/get-categories', async (_, { rejectWithValue }) => {
    try {
        const res = await classApi.getCategoryApi();
        return res.categories
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// &&& update Category &&&
export const updateCategoryThunk = createAsyncThunk('/category/update-category', async ({ id, updateData }, { rejectWithValue }) => {
    try {
        const res = await classApi.updateCategoryApi(id, updateData)
        return res.category
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// &&& delete Category &&&
export const deleteCategoryThunk = createAsyncThunk('/category/delete-category', async (id, { rejectWithValue }) => {
    try {
        const res = await classApi.deleteCategoryApi(id)
        return { id, message: res.message }
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// **************
// ALL CLASS-TYPES THUNK
// ********************

// create class Type Thunk
export const createClassTypeThunk = createAsyncThunk('/type/create-class-type', async (data, { rejectWithValue }) => {
    try {
        const res = await classApi.createClassTypeApi(data)
        return res.type
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// &&& Get Class-Type &&&
export const getClassTypeThunk = createAsyncThunk('/type/get-class-type', async (_, { rejectWithValue }) => {
    try {
        const res = await classApi.getClassTypeApi();
        return res.classTypes
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// &&& update Class-Type &&&
export const updateClassTypeThunk = createAsyncThunk('/type/update-class-type', async ({ typeId, updateData }, { rejectWithValue }) => {
    try {
        const res = await classApi.updateClassTypeApi(typeId, updateData)
        return res.type
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// &&& delete Class-Type &&&
export const deleteClassTypeThunk = createAsyncThunk('/type/delete-class-type', async (typeId, { rejectWithValue }) => {
    try {
        const res = await classApi.deleteClassTypeApi(typeId)
        return { id: typeId, message: res.message }
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// %%%%%%%%%%%%%%
// ALL CLASSES THUNKS
// %%%%%%%%%%%%%%%%%%

export const createClassThunk = createAsyncThunk('/class/create-class', async (data, { rejectWithValue }) => {
    try {
        const res = await classApi.createClassApi(data)
        return res.class
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// &&& Get Classes &&&
export const getAllClassesThunk = createAsyncThunk('/class/get-classes', async (_, { rejectWithValue }) => {
    try {
        const res = await classApi.getAllClassesApi();
        return res.classes
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// &&& update Class &&&
export const updateClassThunk = createAsyncThunk('/class/update-class', async ({ classId, updateData }, { rejectWithValue }) => {
    try {
        const res = await classApi.updateClassApi(classId, updateData)
        return res.class
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// &&& delete Class &&&
export const deleteClassThunk = createAsyncThunk('/class/delete-class', async (classId, { rejectWithValue }) => {
    try {
        const res = await classApi.deleteClassApi(classId)
        return { id: classId, message: res.message }
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// add people in class
export const enrolledMemberInClass = createAsyncThunk('/class/enroll-in-class', async ({ classId, memberId }, { rejectWithValue }) => {
    try {
        const res = await classApi.enrollParticipantApi(classId)
        return res.class
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// remove people in class
export const removeEnrollMemberThunk = createAsyncThunk('/class/remove-from-class', async ({ classId, memberId }, { rejectWithValue }) => {
    try {
        const res = await classApi.removeParticipantApi(classId)
        return res.class
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// canceled class
export const canceledClassThunk = createAsyncThunk('/class/canceled-class', async (classId, { rejectWithValue }) => {
    try {
        const res = await classApi.cancelClassApi(classId)
        return res.class
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// enroll member himself in class
export const enrolledMemberHimselfThunk = createAsyncThunk('/class/enroll', async (classId, { rejectWithValue }) => {
    try {
        const res = await classApi.enrollMySelfInClassApi(classId)
        return res.class
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const myClassesThunk = createAsyncThunk('/class/my-class', async (_, { rejectWithValue }) => {
    try {
        const res = await classApi.myClassesApi()
        return res.class
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

const classSlice = createSlice({
    name: 'classes',
    initialState: {
        classes: [],
        categories: [],
        types: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // &&&&&&&&&&
            // ALL CATEGORIES SLICES
            // &&&&&&&&&&&&&&&

            // get categories
            .addCase(getCategoriesThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(getCategoriesThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload
            })
            .addCase(getCategoriesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            
            // create category
            .addCase(createCategoryThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(createCategoryThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = [...state.categories, action.payload];
            })
            .addCase(createCategoryThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            
            // update category
            .addCase(updateCategoryThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(updateCategoryThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = state.categories.map(cat => 
                    cat._id === action.payload._id ? action.payload : cat
                );
            })
            .addCase(updateCategoryThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            
            // delete category
            .addCase(deleteCategoryThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = state.categories.filter(cat => cat._id !== action.payload.id);
            })
            .addCase(deleteCategoryThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })

            // ******************
            // ALL CLASS-TYPES SLICES
            // ***********************

            // get Class Types
            .addCase(getClassTypeThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(getClassTypeThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.types = action.payload
            })
            .addCase(getClassTypeThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            
            // create Class Type
            .addCase(createClassTypeThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(createClassTypeThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.types = [...state.types, action.payload];
            })
            .addCase(createClassTypeThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            
            // update Class Type
            .addCase(updateClassTypeThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(updateClassTypeThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.types = state.types.map(type => 
                    type._id === action.payload._id ? action.payload : type
                );
            })
            .addCase(updateClassTypeThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            
            // delete Class Type
            .addCase(deleteClassTypeThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(deleteClassTypeThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.types = state.types.filter(type => type._id !== action.payload.id);
            })
            .addCase(deleteClassTypeThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })

            // %%%%%%%%%%%%%
            // ALL CLASS SLICES
            // %%%%%%%%%%%%%%%%%%%

            // get Classes
            .addCase(getAllClassesThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(getAllClassesThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.classes = action.payload
            })
            .addCase(getAllClassesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            
            // create Class
            .addCase(createClassThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(createClassThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.classes = [...state.classes, action.payload];
            })
            .addCase(createClassThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            
            // update Class
            .addCase(updateClassThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(updateClassThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.classes = state.classes.map(cls => 
                    cls._id === action.payload._id ? action.payload : cls
                );
            })
            .addCase(updateClassThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            
            // Delete Class
            .addCase(deleteClassThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(deleteClassThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.classes = state.classes.filter(cls => cls._id !== action.payload.id);
            })
            .addCase(deleteClassThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })

            // enroll participants
            .addCase(enrolledMemberInClass.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(enrolledMemberInClass.fulfilled, (state, action) => {
                state.loading = false;
                state.classes = state.classes.map(cls => 
                    cls._id === action.payload._id ? action.payload : cls
                );
            })
            .addCase(enrolledMemberInClass.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })

            // removed Participants
            .addCase(removeEnrollMemberThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(removeEnrollMemberThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.classes = state.classes.map(cls => 
                    cls._id === action.payload._id ? action.payload : cls
                );
            })
            .addCase(removeEnrollMemberThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            
            // member enrolled himself
            .addCase(enrolledMemberHimselfThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(enrolledMemberHimselfThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.classes = state.classes.map(cls => 
                    cls._id === action.payload._id ? action.payload : cls
                );
            })
            .addCase(enrolledMemberHimselfThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            
            // canceled class
            .addCase(canceledClassThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(canceledClassThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.classes = state.classes.map(cls => 
                    cls._id === action.payload._id ? action.payload : cls
                );
            })
            .addCase(canceledClassThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            
            // my classes
            .addCase(myClassesThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(myClassesThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.classes = action.payload
            })
            .addCase(myClassesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
    }
})

export default classSlice.reducer