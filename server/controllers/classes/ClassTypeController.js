const { ClassTypeModel, CategoryModel } = require('../../models/class/ClassTypeModel');
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

        const { category } = req.body;

        const newCategory = await CategoryModel.create({
            categoryName: category,
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
            classType: newClassType
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
            classType: classType
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
        const { classTypeId, staffId, bookingType, date, time, maxParticipants, studio, frequency, occurrence, dayOfWeek } = req.body;

        // Validate classTypeId
        const classTypeExists = await ClassTypeModel.findById(classTypeId);
        if (!classTypeExists) return res.status(404).json({ success: false, message: "Class type not found" });

        // Validate staffId
        const staffExists = await StaffModel.findById(staffId);
        if (!staffExists) return res.status(404).json({ success: false, message: "Staff member not found" });

        // Validate roomId
        const roomExists = await StudioModel.findById(studio);
        if (!roomExists) return res.status(404).json({ success: false, message: "Room not found" });

        if (bookingType === 'single') {
            const newClass = await ClassModel.create({
                classType: classTypeId,
                staff: staffId,
                bookingType,
                room: studioId,
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
                    room: studio,
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

            return res.status(200).json({ success: true, classes: createdClasses });
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
                path: 'participants',
                select: 'firstName lastName img email'
            })

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
        const { id } = req.params; // class ID
        const { cancelType } = req.body; // "single" or "series"

        const classToCancel = await ClassModel.findById(id);
        if (!classToCancel) return res.status(404).json({ message: "Class not found" });

        let affectedClasses = [];

        // SINGLE BOOKING
        if (classToCancel.bookingType === "single") {
            classToCancel.status = 'canceled';
            classToCancel.classStatus = 'canceled';
            await classToCancel.save();
            affectedClasses = [classToCancel];
        }

        // RECURRING BOOKING
        if (classToCancel.bookingType === "recurring") {
            if (cancelType === "single") {
                classToCancel.status = 'canceled';
                classToCancel.classStatus = 'canceled';
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
                { _id: { $in: cls.participants } },
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
        const { id } = req.params;
        const role = req.user?.role;
        const staffRole = req.user?.staffRole;
        const classToDelete = await ClassModel.findById(id);
        if (!classToDelete) return res.status(404).json({ success: false, message: "Class not found" });




        await ClassModel.findByIdAndDelete(id)

        await StudioModel.findByIdAndUpdate(classToDelete.studio, { $pull: { classes: id } });
        await StaffModel.findByIdAndUpdate(classToDelete.staff, { $pull: { classes: id } });

        return res.status(200).json({ success: true, message: "Class deleted successfully" });

    }
    catch (error) {
        next(error)
    }
}



const enrollMembersToClassByStaff = async (req, res, next) => {
    try {
        const { classId } = req.params;
        const { memberIds } = req.body; // array of member IDs to enroll

        const classToUpdate = await ClassModel.findById(classId);
        if (!classToUpdate) return res.status(404).json({ success: false, message: "Class not found" });

        // Ensure we don't exceed maxParticipants
        if (classToUpdate.participants.length + memberIds.length > classToUpdate.maxParticipants) {
            return res.status(400).json({ success: false, message: "Exceeding maximum participants" });
        }

        // Add members to class participants
        classToUpdate.participants.push(memberIds);
        await classToUpdate.save();

        await MemberModel.updateMany({
            _id: { $in: memberIds }
        }, {
            $push: { classes: classId }
        }, { new: true })
        const members = await MemberModel.find({ _id: { $in: memberIds } }, { email: 1 });
        const emails = members.map(m => m.email);

        await notifyUser(memberIds, emails, "Enrolled in Class", `You have been enrolled in the class ${classToUpdate._id} by staff.`, 'enrolled_in_class')

        console.log("Enrolled members to class:", classToUpdate);
        return res.status(200).json({ success: true, message: "Members enrolled successfully", class: classToUpdate });
    }
    catch (error) {
        next(error)
    }
}


const removeEnrolledMembers = async (req, res, next) => {
    try {
        const { classId } = req.params;
        const { memberIds } = req.body; // array of member IDs to remove

        const classToUpdate = await ClassModel.findById(classId);
        if (!classToUpdate) return res.status(404).json({ success: false, message: "Class not found" });

        // Remove members from class participants
        classToUpdate.participants.pull(memberIds);
        await classToUpdate.save();

        await MemberModel.updateMany({
            _id: { $in: memberIds }
        }, {
            $pull: { classes: classId }
        }, { new: true })
        // Fetch member emails for notification
        const members = await MemberModel.find({ _id: { $in: memberIds } }, { email: 1 });
        const emails = members.map(m => m.email);

        await notifyUser(memberIds, emails, "Removed from Class", `You have been removed from the class ${classToUpdate._id} by staff.`, 'removed_from_class');


        return res.status(200).json({ success: true, message: "Members removed successfully", class: classToUpdate });
    }
    catch (error) {
        next(error)
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
            studioId,
            maxParticipants,
        } = req.body


        const updateData = {}

        const findClass = await ClassModel.findById(classId)

        if (date !== undefined) updateData.date = date
        if (staffId !== undefined) updateData.staff = staffId
        if (time !== undefined) updateData.time = time
        if (maxParticipants !== undefined) updateData.maxParticipants = maxParticipants
        if (studioId !== undefined) updateData.room = studioId


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
        const userId = req.user?._id

        const { classId } = req.params

        const findClass = await ClassModel.findById(classId)

        const updatedClass = await ClassModel.findByIdAndUpdate(classId, {
            $set: { participants: userId }
        }, { new: true, runValidators: true })

        await MemberModel.findByIdAndUpdate(userId, {
            $push: { classes: classId }
        }, { new: true })

        return res.status(200).json({
            success: true,
            class: updatedClass
        })
    }
    catch (error) {
        return next(error)
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
    enrollMyself

}