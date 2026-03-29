const { ClassTypeModel, CategoryModel } = require('../../models/class/ClassTypeModel');
const StudioModel = require('../../models/StudioModel');
const { uploadToCloudinary } = require('../../utils/CloudinaryUpload');


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
        const { classId } = req.params;
        const { name, categoryId, description, duration, maxPeople, calenderColor } = req.body;

        const classType = await ClassTypeModel.findById(classId);
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
        const { classId } = req.params;

        const classType = await ClassTypeModel.findById(classId);
        if (!classType) {
            return res.status(404).json({ success: false, message: "Class type not found" });
        }

        await ClassTypeModel.findByIdAndDelete(classId);

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
    deleteClassType

    // all classes Controller 


}