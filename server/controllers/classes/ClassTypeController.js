const { ClassTypeModel, CategoryModel, RoomModel } = require('../../models/class/ClassTypeModel');
const ClassModel = require('../../models/class/ClassModel');
const StudioModel = require('../../models/StudioModel');
const { uploadToCloudinary } = require('../../utils/CloudinaryUpload');
const { StaffModel, MemberModel } = require('../../models/Discriminators');
const { BadRequestError, NotFoundError } = require('../../middleware/error/httpErrors');
const { v4: uuidv4 } = require('uuid');
const { notifyUser } = require('../../utils/NotificationService');

// ********
// CREATE CATEGORY CONTROLLER
// ********

// *** create Categories ***

const createCategory = async (req, res, next) => {
    try {
        const studioId = req.user?.studio;

        const { category, description } = req.body;

        const newCategory = await CategoryModel.create({
            categoryName: category,
            description,
            studio: studioId
        });
        res.status(201).json({
            success: true,
            category: newCategory
        });

    }
    catch (error) {
        next(error);
    }
}


// *** get all Categories ***
const getAllCategories = async (req, res, next) => {
    try {
        const studioId = req.user?.studio;

        const categories = await CategoryModel.find({ studio: studioId });
        res.status(200).json({
            success: true,
            categories: categories
        });

    }
    catch (error) {
        next(error);
    }
}

// *** update category ***

const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params

        const { category } = req.body;

        const categoryToUpdate = await CategoryModel.findById(id);
        if (!categoryToUpdate) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        const updateCategory = await CategoryModel.findByIdAndUpdate(id, { categoryName: category }, { new: true });

        res.status(200).json({
            success: true,
            category: updateCategory
        });
    }
    catch (error) {
        next(error)
    }
}


// *** Delete Category ***

const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params

        const categoryToDelete = await CategoryModel.findById(id);
        if (!categoryToDelete) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        await CategoryModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    }
    catch (error) {
        next(error)
    }
}
// ********
// CREATE Room CONTROLLER
// ********

// *** create room ***

const createRoom = async (req, res, next) => {
    try {
        const studioId = req.user?.studio;

        const { room, description } = req.body;

        const newRoom = await RoomModel.create({
            roomName: room,
            description,
            studio: studioId
        });
        res.status(201).json({
            success: true,
            room: newRoom
        });

    }
    catch (error) {
        next(error);
    }
}


// *** get all Rooms ***
const getAllRoom = async (req, res, next) => {
    try {
        const studioId = req.user?.studio;

        const rooms = await RoomModel.find({ studio: studioId });
        res.status(200).json({
            success: true,
            rooms: rooms
        });

    }
    catch (error) {
        next(error);
    }
}

// *** update Room ***

const updateRoom = async (req, res, next) => {
    try {
        const { id } = req.params

        const { room } = req.body;

        const roomToUpdate = await RoomModel.findById(id);
        if (!roomToUpdate) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        const updateRoom = await RoomModel.findByIdAndUpdate(id, { roomName: room }, { new: true });

        res.status(200).json({
            success: true,
            room: updateRoom
        });
    }
    catch (error) {
        next(error)
    }
}


// *** Delete Room ***

const deleteRoom = async (req, res, next) => {
    try {
        const { id } = req.params

        const roomToDelete = await RoomModel.findById(id);
        if (!roomToDelete) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        await RoomModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Room deleted successfully"
        });
    }
    catch (error) {
        next(error)
    }
}

// &&&&&&&&&&&&&&&&&&&
// CLASS-TYPES CONTROLLER BELOW
// &&&&&&&&&&&&&&&&&&&


// &&& CREATE CLASS-TYPE &&&

const createClassType = async (req, res, next) => {
    try {
        const studioId = req.user?.studio;

        const { name, categoryId, description, duration, maxPeople, calenderColor } = req.body;

        let imgData = null;
        if (req.file) {
            imgData = await uploadToCloudinary(req.file.buffer);
        }

        const categoryExists = await CategoryModel.findById(categoryId);
        if (!categoryExists) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        const newClassType = await ClassTypeModel.create({
            name,
            category: categoryId,
            description,
            duration,
            maxPeople,
            calenderColor,
            studio: studioId,
            img: imgData ? { url: imgData.secure_url, public_id: imgData.public_id } : null
        })


        await StudioModel.findByIdAndUpdate(studioId, { $push: { classTypes: newClassType._id } }, { new: true })
        res.status(201).json({
            success: true,
            type: newClassType
        });
    }
    catch (error) {
        next(error)
    }
}

// &&& GET CLASS-TYPES &&&
const getClassTypes = async (req, res, next) => {
    try {
        const studioId = req.user?.studio;


        const classTypes = await ClassTypeModel.find({ studio: studioId }).populate('category', 'categoryName');
        return res.status(200).json({
            success: true,
            classTypes: classTypes
        })
    }
    catch (error) {
        next(error)
    }
}

// &&& UPDATE CLASS-TYPE &&&
const updateClassTypes = async (req, res, next) => {
    try {
        const { typeId } = req.params;
        const { name, categoryId, description, duration, maxPeople, calenderColor } = req.body;

        const classType = await ClassTypeModel.findById(typeId);
        if (!classType) {
            return res.status(404).json({ success: false, message: "Class type not found" });
        }

        if (categoryId) {
            const categoryExists = await CategoryModel.findById(categoryId);
            if (!categoryExists) {
                return res.status(404).json({ success: false, message: "Category not found" });
            }
            if (category === undefined) classType.category = categoryId;
        }

        if (req.file) {
            const imgData = await uploadToCloudinary(req.file.buffer);
            if (classType.img === undefined) {
                classType.img = { url: imgData.secure_url, public_id: imgData.public_id };
            }
        }


        if (name === undefined) classType.name = name;
        if (description === undefined) classType.description = description;
        if (duration === undefined) classType.duration = duration;
        if (maxPeople === undefined) classType.maxPeople = maxPeople;
        if (calenderColor === undefined) classType.calenderColor = calenderColor;

        await classType.save();

        res.status(200).json({
            success: true,
            type: classType
        });
    }
    catch (error) {
        next(error)
    }
}

// &&& DELETE CLASS-TYPE &&&
const deleteClassType = async (req, res, next) => {
    try {
        const { typeId } = req.params;

        const classType = await ClassTypeModel.findById(typeId);
        if (!classType) {
            return res.status(404).json({ success: false, message: "Class type not found" });
        }

        await ClassTypeModel.findByIdAndDelete(typeId);

        res.status(200).json({
            success: true,
            message: "Class type deleted successfully"
        });
    }
    catch (error) {
        next(error)
    }
}



// $$$$$$$$$$$$$$$
// ALL CLASSES CONTROLLER CAN BE ADDED BELOW
// $$$$$$$$$$$$$$$


// create CLass


const createClassByStaff = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const studioId = req.user?.studio;
        const { classTypeId, staffId, bookingType, date, time, maxParticipants, roomId, frequency, occurrence, dayOfWeek } = req.body;

        // Validate classTypeId
        const classTypeExists = await ClassTypeModel.findById(classTypeId);
        if (!classTypeExists) return res.status(404).json({ success: false, message: "Class type not found" });

        // Validate staffId
        const staffExists = await StaffModel.findById(staffId);
        if (!staffExists) return res.status(404).json({ success: false, message: "Staff member not found" });

        // Validate roomId
        const roomExists = await RoomModel.findById(roomId);
        if (!roomExists) return res.status(404).json({ success: false, message: "Room not found" });

        if (bookingType === 'single') {
            const newClass = await ClassModel.create({
                classType: classTypeId,
                staff: staffId,
                bookingType,
                room: roomId,
                date,
                time,
                maxParticipants,
                classCreatedBy: userId,
                studio: studioId,
                status: 'confirmed'
            });

            await StudioModel.findByIdAndUpdate(studioId, { $push: { classes: newClass._id } });
            await StaffModel.findByIdAndUpdate(staffId, { $push: { classes: newClass._id } });

            return res.status(200).json({ success: true, class: newClass });
        }

        if (bookingType === 'recurring') {
            if (!frequency || !occurrence) throw new BadRequestError("Missing Recurring Details");

            const classes = [];
            const seriesId = uuidv4(); // unique ID for this recurring series
            let currentDate = new Date(date);

            for (let i = 0; i < occurrence; i++) {
                classes.push({
                    classType: classTypeId,
                    staff: staffId,
                    frequency,
                    dayOfWeek,
                    occurrence,
                    room: roomId,
                    bookingType: 'recurring',
                    date: new Date(currentDate), // use currentDate
                    time,
                    maxParticipants,
                    classCreatedBy: userId,
                    studio: studioId,
                    status: 'confirmed',
                    seriesId // add seriesId to group all recurring classes
                });

                // increment currentDate
                if (frequency === 'daily') currentDate.setDate(currentDate.getDate() + 1);
                if (frequency === 'weekly') currentDate.setDate(currentDate.getDate() + 7);
                if (frequency === 'monthly') currentDate.setMonth(currentDate.getMonth() + 1);
            }

            const createdClasses = await ClassModel.insertMany(classes);

            const classIds = createdClasses.map(c => c._id);
            await StudioModel.findByIdAndUpdate(studioId, { $push: { classes: { $each: classIds } } });
            await StaffModel.findByIdAndUpdate(staffId, { $push: { classes: { $each: classIds } } });

            return res.status(200).json({ success: true, class: createdClasses });
        }

        return res.status(400).json({ success: false, message: "Invalid bookingType" });

    } catch (error) {
        next(error);
    }
};


// get all CLassess
const getClasses = async (req, res, next) => {
    try {
        const studioId = req.user?.studio

        const classes = await ClassModel.find({ studio: studioId })
            .populate({
                path: 'classType',
                select: 'img name duration category calenderColor',
                populate: ({
                    path: 'category',
                    select: 'categoryName'
                })
            })
            .populate('staff', 'firstName lastName img email')
            .populate({
                path: 'enrolledMembers',
                select: 'firstName lastName img email'
            })
            .populate('room', 'roomName')

        return res.status(200).json({
            success: true,
            count: classes.length,
            classes: classes
        })
    }
    catch (error) {
        next(error)
    }
}

const cancelClass = async (req, res, next) => {
    try {
        const { classId } = req.params; // class ID
        const { cancelType } = req.body; // "single" or "series"

        const classToCancel = await ClassModel.findById(classId);
        if (!classToCancel) return res.status(404).json({ message: "Class not found" });

        let affectedClasses = [];

        // SINGLE BOOKING
        if (classToCancel.bookingType === "single") {
            classToCancel.status = 'canceled';
            classToCancel.classStatus = 'canceled';
            classToCancel.isCanceled = true;
            await classToCancel.save();
            affectedClasses = [classToCancel];
        }

        // RECURRING BOOKING
        if (classToCancel.bookingType === "recurring") {
            if (cancelType === "single") {
                classToCancel.status = 'canceled';
                classToCancel.classStatus = 'canceled';
                classToCancel.isCanceled = true;
                await classToCancel.save();
                affectedClasses = [classToCancel];
            }

            if (cancelType === "series") {
                affectedClasses = await ClassModel.find({
                    seriesId: classToCancel.seriesId,
                    date: { $gte: classToCancel.date }
                });

                await ClassModel.updateMany(
                    { seriesId: classToCancel.seriesId, date: { $gte: classToCancel.date } },
                    { $set: { status: 'canceled', classStatus: 'canceled' } }
                );
            }
        }

        // Notify all participants of affected classes
        for (const cls of affectedClasses) {
            const members = await MemberModel.find(
                { _id: { $in: cls.enrolledMembers } },
                { email: 1 }
            );
            const memberIds = members.map(m => m._id);
            const emails = members.map(m => m.email);

            try {
                await notifyUser(
                    memberIds,
                    emails,
                    "Class Canceled",
                    `Your class ${cls.classType} on ${cls.date.toDateString()} has been canceled by staff.`,
                    'classCancellation'
                );
            } catch (err) {
                console.error(`Failed to notify members of class ${cls._id}:`, err.message);
            }
        }

        return res.status(200).json({
            message: cancelType === "series" ? "Recurring series cancelled" : "Class cancelled"
        });

    } catch (error) {
        next(error);
    }
};

const deleteClass = async (req, res, next) => {
    try {
        const { classId } = req.params;

        const classToDelete = await ClassModel.findById(classId);
        if (!classToDelete) return res.status(404).json({ success: false, message: "Class not found" });

        const deleteClass = await ClassModel.findByIdAndDelete(classId)


        await StudioModel.findByIdAndUpdate(classToDelete.studio, { $pull: { classes: classId } });
        await StaffModel.findByIdAndUpdate(classToDelete.staff, { $pull: { classes: classId } });

        return res.status(200).json({ success: true, message: "Class deleted successfully" });

    }
    catch (error) {
        next(error)
    }
}



const enrollMembersToClassByStaff = async (req, res, next) => {
    try {
        const { classId } = req.params;
        let { memberIds } = req.body; // can be single ID or array of IDs

        // Normalize memberIds to always be an array
        if (!memberIds) {
            return res.status(400).json({
                success: false,
                message: "memberIds is required"
            });
        }

        // Convert single ID to array
        if (!Array.isArray(memberIds)) {
            memberIds = [memberIds];
        }

        // Remove duplicates and filter out invalid entries
        memberIds = [...new Set(memberIds)].filter(id => id && id.trim());

        if (memberIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one valid member ID is required"
            });
        }

        const classToUpdate = await ClassModel.findById(classId);
        if (!classToUpdate) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        // Check which members are already enrolled
        const existingMemberIds = classToUpdate.enrolledMembers.map(id => id.toString());
        const newMemberIds = memberIds.filter(id => !existingMemberIds.includes(id));

        if (newMemberIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "All specified members are already enrolled in this class"
            });
        }

        // Check capacity
        const currentCount = classToUpdate.enrolledMembers.length;
        const newCount = newMemberIds.length;

        if (currentCount + newCount > classToUpdate.maxParticipants) {
            return res.status(400).json({
                success: false,
                message: `Cannot enroll ${newCount} member${newCount > 1 ? 's' : ''}. Maximum participants is ${classToUpdate.maxParticipants}. Currently enrolled: ${currentCount}`
            });
        }

        // Add members to class
        classToUpdate.enrolledMembers.push(...newMemberIds);
        await classToUpdate.save();

        // Update members with the class
        await MemberModel.updateMany(
            { _id: { $in: newMemberIds } },
            { $push: { classes: classId } }
        );

        // Get member details for notification
        const members = await MemberModel.find(
            { _id: { $in: newMemberIds } },
            { email: 1, name: 1 }
        );

        // Send notifications (if notifyUser function exists)
        if (members.length > 0) {
            const emails = members.map(m => m.email);
            const memberNames = members.map(m => m.name).join(', ');

            await notifyUser(
                newMemberIds,
                emails,
                "Enrolled in Class",
                `You ${members.length > 1 ? 'have been' : 'have been'} enrolled in ${classToUpdate.name || 'the class'} by staff.`,
                'enrolled_in_class'
            );
        }

        console.log(`Enrolled ${newMemberIds.length} member(s) to class:`, classToUpdate._id);

        // Return updated class with populated member details
        const populatedClass = await ClassModel.findById(classId)
            .populate('enrolledMembers', 'name email');

        return res.status(200).json({
            success: true,
            message: `${newMemberIds.length} member${newMemberIds.length > 1 ? 's' : ''} enrolled successfully`,
            class: populatedClass,
            enrolledCount: newMemberIds.length,
            enrolledMembers: newMemberIds
        });
    }
    catch (error) {
        console.error("Error in enrollMembersToClassByStaff:", error);
        next(error);
    }
}


const removeEnrolledMembers = async (req, res, next) => {
    try {
        const { classId } = req.params;
        let { memberIds } = req.body; // can be single ID or array of IDs

        // Validate and normalize memberIds
        if (!memberIds) {
            return res.status(400).json({
                success: false,
                message: "memberIds is required"
            });
        }

        // Convert single ID to array
        if (!Array.isArray(memberIds)) {
            memberIds = [memberIds];
        }

        // Remove duplicates and filter out invalid entries
        memberIds = [...new Set(memberIds)].filter(id => id && id.trim());

        if (memberIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one valid member ID is required"
            });
        }

        // Find the class
        const classToUpdate = await ClassModel.findById(classId);
        if (!classToUpdate) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        // Check which members are actually enrolled
        const enrolledMemberIds = classToUpdate.enrolledMembers.map(id => id.toString());
        const membersToRemove = memberIds.filter(id => enrolledMemberIds.includes(id));

        if (membersToRemove.length === 0) {
            return res.status(400).json({
                success: false,
                message: "None of the specified members are enrolled in this class"
            });
        }

        // Remove members from class participants
        // Using $pull with $in for multiple IDs
        await ClassModel.findByIdAndUpdate(
            classId,
            { $pull: { enrolledMembers: { $in: membersToRemove } } },
            { new: true }
        );

        // Remove class from members' enrolled classes
        await MemberModel.updateMany(
            { _id: { $in: membersToRemove } },
            { $pull: { classes: classId } }
        );

        // Fetch member details for notification
        const members = await MemberModel.find(
            { _id: { $in: membersToRemove } },
            { email: 1, name: 1 }
        );

        // Send notifications
        if (members.length > 0) {
            const emails = members.map(m => m.email);
            const memberNames = members.map(m => m.name).join(', ');

            await notifyUser(
                membersToRemove,
                emails,
                "Removed from Class",
                `You ${membersToRemove.length > 1 ? 'have been' : 'have been'} removed from ${classToUpdate.name || 'the class'} by staff.`,
                'removed_from_class'
            );
        }

        // Get the updated class with populated data
        const updatedClass = await ClassModel.findById(classId)
            .populate('enrolledMembers', 'name email');

        console.log(`Removed ${membersToRemove.length} member(s) from class:`, classToUpdate._id);

        return res.status(200).json({
            success: true,
            message: `${membersToRemove.length} member${membersToRemove.length > 1 ? 's' : ''} removed successfully`,
            class: updatedClass,
            removedCount: membersToRemove.length,
            removedMembers: membersToRemove
        });
    }
    catch (error) {
        console.error("Error in removeEnrolledMembers:", error);
        next(error);
    }
}



const updateClassById = async (req, res, next) => {
    try {
        const { classId } = req.params;
        const userId = req.user?._id;

        const {
            date,
            staffId,
            time,
            roomId,
            maxParticipants,
        } = req.body


        const updateData = {}

        const findClass = await ClassModel.findById(classId)

        if (date !== undefined) updateData.date = date
        if (staffId !== undefined) updateData.staff = staffId
        if (time !== undefined) updateData.time = time
        if (maxParticipants !== undefined) updateData.maxParticipants = maxParticipants
        if (roomId !== undefined) updateData.room = roomId


        const updatedClass = await ClassModel.findByIdAndUpdate(classId,
            updateData, { new: true, runValidators: true })

        return res.status(200).json({
            success: true,
            class: updatedClass
        })

    }
    catch (error) {
        next(error)
    }
}



const enrollMyself = async (req, res, next) => {
    try {
        const userId = req.user?._id;

        // Check if user is authenticated
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        const { classId } = req.params;

        // Validate classId
        if (!classId) {
            return res.status(400).json({
                success: false,
                message: "Class ID is required"
            });
        }

        // Find the class
        const findClass = await ClassModel.findById(classId);

        if (!findClass) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        // Check if user is already enrolled
        const isAlreadyEnrolled = findClass.enrolledMembers.some(
            member => member.toString() === userId.toString()
        );

        if (isAlreadyEnrolled) {
            return res.status(400).json({
                success: false,
                message: "You are already enrolled in this class"
            });
        }

        // Check if class is full
        if (findClass.enrolledMembers.length >= findClass.maxParticipants) {
            return res.status(400).json({
                success: false,
                message: `Class is full. Maximum capacity: ${findClass.maxParticipants}`
            });
        }

        // Check if class is still available (e.g., not cancelled, not past date)
        if (findClass.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: "This class has been cancelled"
            });
        }

        // Check if enrollment deadline has passed (if applicable)
        if (findClass.enrollmentDeadline && new Date() > new Date(findClass.enrollmentDeadline)) {
            return res.status(400).json({
                success: false,
                message: "Enrollment deadline has passed"
            });
        }

        // IMPORTANT FIX: Use $push instead of $set to add to array
        const updatedClass = await ClassModel.findByIdAndUpdate(
            classId,
            { $push: { enrolledMembers: userId } }, // Changed from $set to $push
            { new: true, runValidators: true }
        );

        // Update member's enrolled classes
        await MemberModel.findByIdAndUpdate(
            userId,
            { $push: { classes: classId } },
            { new: true }
        );

        // Optional: Send confirmation notification
        try {
            const member = await MemberModel.findById(userId, { email: 1, name: 1 });
            if (member && member.email) {
                await notifyUser(
                    [userId],
                    [member.email],
                    "Enrolled in Class",
                    `You have successfully enrolled in ${findClass.name || 'the class'}.`,
                    'self_enrolled_in_class'
                );
            }
        } catch (notificationError) {
            // Don't fail the enrollment if notification fails
            console.error("Failed to send notification:", notificationError);
        }

        // Populate enrolled members for response
        const populatedClass = await ClassModel.findById(classId)
            .populate('enrolledMembers', 'name email');

        return res.status(200).json({
            success: true,
            message: "Successfully enrolled in class",
            class: populatedClass
        });
    }
    catch (error) {
        console.error("Error in enrollMyself:", error);
        return next(error);
    }
}

// my classes

const myClasses = async (req, res, next) => {
    try {
        const userId = req.user?._id
        const myClasses = await ClassModel.find({ enrolledMembers: userId })
            .populate({
                path: 'classType',
                select: 'img name duration category calenderColor',
                populate: ({
                    path: 'category',
                    select: 'categoryName'
                })
            })
            .populate('staff', 'firstName lastName staffRole')
            .populate('room', 'roomName')

        return res.status(200).json({
            success: true,
            class: myClasses
        })
    }
    catch (error) {
        next(error)
    }
}


module.exports = {

    // All Category related controllers
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,

    // all Class-Types Controller
    createClassType,
    getClassTypes,
    updateClassTypes,
    deleteClassType,

    // all classes Controller 
    createClassByStaff,
    getClasses,
    deleteClass,
    cancelClass,
    enrollMembersToClassByStaff,
    removeEnrolledMembers,
    updateClassById,
    enrollMyself,
    myClasses,

    // all room controller
    createRoom,
    getAllRoom,
    updateRoom,
    deleteRoom




}