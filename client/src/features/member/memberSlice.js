import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as memberApi from "./memberApi";

// ============================================
// Existing Member Thunks
// ============================================

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
        return res.members
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

// Update Member Detail By Staff
export const memberUpdatedByStaff = createAsyncThunk('/update/staff/memberId', async ({ memberId, updateMember }, { rejectWithValue }) => {
    try {
        const res = await memberApi.updateMemberByStaff(memberId, updateMember)
        return res.member
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// ============================================
// Member Profile Update Approval Workflow Thunks
// ============================================

/**
 * Get pending profile updates (Staff/Admin)
 */
export const getPendingProfileUpdates = createAsyncThunk(
    'member/getPendingProfileUpdates',
    async (_, { rejectWithValue }) => {
        try {
            const res = await memberApi.getPendingProfileUpdates();
            return res.members || [];
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch pending updates');
        }
    }
);

/**
 * Approve profile update (Staff/Admin)
 */
export const approveProfileUpdate = createAsyncThunk(
    'member/approveProfileUpdate',
    async (memberId, { rejectWithValue }) => {
        try {
            const res = await memberApi.approveProfileUpdate(memberId);
            return res.member;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to approve update');
        }
    }
);

/**
 * Reject profile update (Staff/Admin)
 */
export const rejectProfileUpdate = createAsyncThunk(
    'member/rejectProfileUpdate',
    async ({ memberId, reason }, { rejectWithValue }) => {
        try {
            const res = await memberApi.rejectProfileUpdate(memberId, reason);
            return { memberId, member: res.member };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to reject update');
        }
    }
);

/**
 * Get profile update status for logged-in member
 */
export const getProfileUpdateStatus = createAsyncThunk(
    'member/getProfileUpdateStatus',
    async (_, { rejectWithValue }) => {
        try {
            const res = await memberApi.getProfileUpdateStatus();
            return res;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch update status');
        }
    }
);

const memberSlice = createSlice({
    name: 'member',
    initialState: {
        members: [],
        memberFilters: [],
        filterStatus: 'all',
        filterMemberType: 'all',
        token: null,
        loading: false,
        error: null,
        // New states for approval workflow
        pendingProfileUpdates: [],
        profileUpdateStatus: null
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
        clearProfileUpdateError: (state) => {
            state.error = null;
        },
        clearProfileUpdateStatus: (state) => {
            state.profileUpdateStatus = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // ============================================
            // Fetch All Members
            // ============================================
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

            // ============================================
            // Create Member
            // ============================================
            .addCase(memberCreate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(memberCreate.fulfilled, (state, action) => {
                state.loading = false;
                state.members.push(action.payload);
            })
            .addCase(memberCreate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to create member';
            })

            // ============================================
            // Create Temporary Member
            // ============================================
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
                state.error = action.payload?.message;
            })

            // ============================================
            // Update Member By Staff
            // ============================================
            .addCase(memberUpdatedByStaff.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(memberUpdatedByStaff.fulfilled, (state, action) => {
                state.loading = false;
                // Update the specific member in the members array
                const index = state.members.findIndex(m => m._id === action.payload._id);
                if (index !== -1) {
                    state.members[index] = action.payload;
                } else {
                    state.members.push(action.payload);
                }
            })
            .addCase(memberUpdatedByStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            // ============================================
            // Get Pending Profile Updates (Staff/Admin)
            // ============================================
            .addCase(getPendingProfileUpdates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPendingProfileUpdates.fulfilled, (state, action) => {
                state.loading = false;
                state.pendingProfileUpdates = action.payload;
            })
            .addCase(getPendingProfileUpdates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ============================================
            // Approve Profile Update
            // ============================================
            .addCase(approveProfileUpdate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(approveProfileUpdate.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the approved update from pending list
                state.pendingProfileUpdates = state.pendingProfileUpdates.filter(
                    member => member._id !== action.payload._id
                );
                // Update the member in the main members array if present
                const index = state.members.findIndex(m => m._id === action.payload._id);
                if (index !== -1) {
                    state.members[index] = action.payload;
                }
            })
            .addCase(approveProfileUpdate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ============================================
            // Reject Profile Update
            // ============================================
            .addCase(rejectProfileUpdate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(rejectProfileUpdate.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the rejected update from pending list
                state.pendingProfileUpdates = state.pendingProfileUpdates.filter(
                    member => member._id !== action.payload.memberId
                );
            })
            .addCase(rejectProfileUpdate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ============================================
            // Get Profile Update Status
            // ============================================
            .addCase(getProfileUpdateStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProfileUpdateStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.profileUpdateStatus = action.payload;
            })
            .addCase(getProfileUpdateStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export const { 
    updateMemberDocuments, 
    addMember, 
    updateMember, 
    unarchiveMember, 
    archiveMember, 
    setMemberFilters, 
    setFilterStatus, 
    setFilterMemberType,
    clearProfileUpdateError,
    clearProfileUpdateStatus
} = memberSlice.actions;

export default memberSlice.reducer;