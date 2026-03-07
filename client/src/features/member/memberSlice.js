import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as memberApi from "./memberApi";


// // loginMember



// create Member
export const memberCreate = createAsyncThunk('member/create', async (memberData, { rejectWithValue }) => {
    try {
        const res = await memberApi.registerMember(memberData)
        return res.user
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})



export const fetchAllMember = createAsyncThunk('member/all', async (_, { rejectWithValue }) => {
    try {
        const res = await memberApi.allMember()
        return res.member
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})




export const createTemporaryMember = createAsyncThunk('member/temporary', async (memberData, { rejectWithValue }) => {
    try {
        const res = await memberApi.temporaryMember(memberData);
        return res.user;
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})


// ===================================
// Update Member Detail By Staff
// ===================================


export const memberUpdatedByStaff = createAsyncThunk('/update/staff/memberId', async ({ memberId, updateMember }, { rejectWithValue }) => {
    try {
        const res = await memberApi.updateMemberByStaff(memberId, updateMember)
        return res.member
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})




const memberSlice = createSlice({

    name: 'member',
    initialState: {
        members: [],
        memberFilters: [],
        filterStatus: 'all',
        filterMemberType: 'all',
        token: null,
        loading: false,
        error: null
    },
    reducers: {
        setMemberFilters: (state, action) => {
            state.memberFilters = action.payload;
        },
        setFilterStatus: (state, action) => {
            state.filterStatus = action.payload;
        },
        setFilterMemberType: (state, action) => {
            state.filterMemberType = action.payload;
        },
        updateMemberDocuments: (state, action) => {
            const { memberId, documentData } = action.payload;

            const member = state.members.find((m) => m._id === memberId);
            if (!member) return;

            const existingDocuments = member.documents || [];

            if (documentData.isEdit) {
                member.documents = existingDocuments.map((doc) =>
                    doc._id === documentData._id ? documentData : doc
                );
            } else {
                member.documents = [...existingDocuments, documentData];
            }

            member.hasAssessment = true;
        },
        addMember: (state, action) => {
            state.members.push(action.payload);
        },
        updateMember: (state, action) => {
            const { memberId, updatedData } = action.payload;

            const member = state.members.find(
                (m) => m._id === memberId
            );

            if (member) {
                Object.assign(member, updatedData);
            }
        },
        unarchiveMember: (state, action) => {
            const memberId = action.payload;

            const member = state.members.find(
                (m) => m._id === memberId
            );

            if (member && member.memberType === "temporary") {
                member.isArchived = false;
                member.archivedDate = null;
            }
        },
        archiveMember: (state, action) => {
            const memberId = action.payload;

            const member = state.members.find((m) => m._id === memberId);

            if (member && member.memberType === "temporary") {
                member.isArchived = true;
                member.archivedDate = new Date().toISOString().split("T")[0];
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllMember.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllMember.fulfilled, (state, action) => {
                state.loading = false;
                state.members = action.payload;
            })
            .addCase(fetchAllMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch members';
            })

            // create member
            .addCase(memberCreate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(memberCreate.fulfilled, (state, action) => {
                state.loading = false;
                state.members.push(action.payload); // ✅ automatically add new member
            })
            .addCase(memberCreate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to create member';
            })

            // temporary Member
            .addCase(createTemporaryMember.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTemporaryMember.fulfilled, (state, action) => {
                state.loading = false;
                state.members.push(action.payload);
            })
            .addCase(createTemporaryMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })

            // ++++++++++++++
            // update by Staff
            // +++++++++++++
            .addCase(memberUpdatedByStaff.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(memberUpdatedByStaff.fulfilled, (state, action) => {
                state.loading = false;
                state.members = action.payload;
            })
            .addCase(memberUpdatedByStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })

    }
})

export const { updateMemberDocuments, addMember, updateMember, unarchiveMember, archiveMember, setMemberFilters, setFilterStatus, setFilterMemberType } = memberSlice.actions;
export default memberSlice.reducer;