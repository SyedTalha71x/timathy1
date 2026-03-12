const TodoModel = require('../models/TodoModel')
const TagsModel = require('../models/TagsModel')
const { ConflictError, BadRequestError, NotFoundError } = require('../middleware/error/httpErrors');
const { StaffModel } = require('../models/Discriminators');

// ===================
// create Tag
// ===================

const createTags = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const studioId = req.user?.studio
        const { name, color } = req.body

        // Check if tag with same name exists for this studio
        const existingTag = await TagsModel.findOne({ name, studioId })
        if (existingTag) throw new ConflictError("Tag with this name already exists")

        const tags = await TagsModel.create({
            name,
            color,
            studioId: studioId
        })

        return res.status(201).json({
            success: true,
            tags: tags
        })
    }
    catch (error) {
        next(error)
    }
}

// ======================
// get tags
// ======================

const getTags = async (req, res, next) => {
    try {
        const studioId = req.user?.studio

        const findTags = await TagsModel.find({ studioId: studioId })

        if (findTags.length === 0) {
            return res.status(200).json({
                success: true,
                tags: [],
                message: "No tags available for this studio"
            })
        }

        return res.status(200).json({
            success: true,
            tags: findTags
        })
    }
    catch (error) {
        next(error)
    }
}

// ======================
// create todos
// ======================

const createTodos = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const studioId = req.user?.studio

        const { 
            title, 
            status, 
            dueDate, 
            dueTime, 
            reminder, 
            customReminder, 
            reminderSent, 
            repeat, 
            repeatSettings, // Note: field name changed from repeatSetting to repeatSettings
            isPinned, 
            assigneesId, 
            tagsId 
        } = req.body;

        // Handle both single ID and array of IDs for assignees
        const assigneesIdArray = Array.isArray(assigneesId) ? assigneesId : (assigneesId ? [assigneesId] : []);

        // Validate at least one assignee if provided
        if (assigneesIdArray.length === 0) {
            throw new BadRequestError("At least one assignee is required");
        }

        // Validate all staff members exist
        const staffMembers = await StaffModel.find({
            _id: { $in: assigneesIdArray },
            studioId: studioId // Ensure staff belongs to this studio
        });

        if (staffMembers.length !== assigneesIdArray.length) {
            throw new BadRequestError("One or more staff IDs are invalid or don't belong to this studio");
        }

        // Validate tag if provided
        if (tagsId) {
            const tagId = await TagsModel.findOne({ 
                _id: tagsId, 
                studioId: studioId // Ensure tag belongs to this studio
            });
            if (!tagId) throw new BadRequestError("Invalid Tag or tag doesn't belong to this studio");
        }

        // Validate custom reminder structure
        if (reminder === 'Custom' && (!customReminder || !customReminder.value || !customReminder.unit)) {
            throw new BadRequestError("Custom reminder requires value and unit");
        }

        // Validate repeat settings
        if (repeat === 'Custom' && !repeatSettings) {
            throw new BadRequestError("Custom repeat requires repeatSettings");
        }

        // Prepare todo data
        const todoData = {
            title,
            status: status || 'ongoing',
            dueDate: dueDate || Date.now(),
            dueTime,
            reminder: reminder || 'None',
            repeat: repeat || 'None',
            isPinned: isPinned || false,
            assignees: assigneesIdArray,
            studioId: studioId,
            createdBy: userId
        };

        // Add optional fields if they exist
        if (customReminder) todoData.customReminder = customReminder;
        if (reminderSent !== undefined) todoData.reminderSent = reminderSent;
        if (repeatSettings) todoData.repeatSettings = repeatSettings;
        if (tagsId) todoData.tags = [tagsId]; // Tags is an array in schema

        // Create the todo task
        const todoTask = await TodoModel.create(todoData);

        if (!todoTask) throw new BadRequestError("Failed to create todo");

        // Update all staff members with the new task using bulkWrite
        const bulkOps = assigneesIdArray.map(staffId => ({
            updateOne: {
                filter: { _id: staffId },
                update: { $addToSet: { tasks: todoTask._id } }
            }
        }));

        if (bulkOps.length > 0) {
            await StaffModel.bulkWrite(bulkOps);
        }

        // Populate the response
        const populatedTodo = await TodoModel.findById(todoTask._id)
            .populate('assignees', 'firstName lastName email')
            .populate('tags', 'name color')
            .populate('createdBy', 'firstName lastName');

        return res.status(201).json({
            success: true,
            todos: populatedTodo,
            assignedTo: assigneesIdArray.length
        });

    }
    catch (error) {
        next(error);
    }
}

// =============================
// Get Todos List
// =============================

const getTodos = async (req, res, next) => {
    try {
        const studioId = req.user?.studio;
        const { status, assigneeId, tagId, isPinned, search } = req.query;

        // Build filter object
        const filter = { studioId: studioId };

        // Add optional filters
        if (status) filter.status = status;
        if (assigneeId) filter.assignees = assigneeId;
        if (tagId) filter.tags = tagId;
        if (isPinned !== undefined) filter.isPinned = isPinned === 'true';
        
        // Text search on title
        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }

        const findTodos = await TodoModel.find(filter)
            .populate('assignees', 'firstName lastName email profileImage')
            .populate('tags', 'name color')
            .populate('createdBy', 'firstName lastName')
            .populate('completedBy', 'firstName lastName')
            .populate('canceledBy', 'firstName lastName')
            .sort({ isPinned: -1, dueDate: 1, createdAt: -1 }); // Pinned first, then by due date

        return res.status(200).json({
            success: true,
            count: findTodos.length,
            todos: findTodos
        });
    }
    catch (error) {
        next(error);
    }
}

// =================
// Get Single Todo
// =================

const getTodoById = async (req, res, next) => {
    try {
        const studioId = req.user?.studio;
        const { todoId } = req.params;

        const todo = await TodoModel.findOne({ 
            _id: todoId, 
            studioId: studioId 
        })
        .populate('assignees', 'firstName lastName email profileImage')
        .populate('tags', 'name color')
        .populate('createdBy', 'firstName lastName')
        .populate('completedBy', 'firstName lastName')
        .populate('canceledBy', 'firstName lastName');

        if (!todo) throw new NotFoundError("Todo not found");

        return res.status(200).json({
            success: true,
            todo: todo
        });
    }
    catch (error) {
        next(error);
    }
}

// =================
// Update Todo
// =================

const updateTodo = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const studioId = req.user?.studio;
        const { todoId } = req.params;

        const updateData = {
            ...req.body,
            updatedBy: userId,
            updatedAt: new Date()
        };

        // Handle assignees update if provided
        if (req.body.assigneesId) {
            const newAssignees = Array.isArray(req.body.assigneesId) 
                ? req.body.assigneesId 
                : [req.body.assigneesId];
            
            // Get current todo to find removed assignees
            const currentTodo = await TodoModel.findOne({ _id: todoId, studioId });
            
            if (currentTodo) {
                // Find removed assignees
                const removedAssignees = currentTodo.assignees.filter(
                    id => !newAssignees.includes(id.toString())
                );
                
                // Remove task from removed assignees
                if (removedAssignees.length > 0) {
                    const removeBulkOps = removedAssignees.map(staffId => ({
                        updateOne: {
                            filter: { _id: staffId },
                            update: { $pull: { tasks: todoId } }
                        }
                    }));
                    await StaffModel.bulkWrite(removeBulkOps);
                }
                
                // Add task to new assignees
                const addedAssignees = newAssignees.filter(
                    id => !currentTodo.assignees.includes(id)
                );
                
                if (addedAssignees.length > 0) {
                    const addBulkOps = addedAssignees.map(staffId => ({
                        updateOne: {
                            filter: { _id: staffId },
                            update: { $addToSet: { tasks: todoId } }
                        }
                    }));
                    await StaffModel.bulkWrite(addBulkOps);
                }
            }
            
            updateData.assignees = newAssignees;
            delete updateData.assigneesId;
        }

        const todo = await TodoModel.findOneAndUpdate(
            { _id: todoId, studioId: studioId },
            updateData,
            { new: true, runValidators: true }
        )
        .populate('assignees', 'firstName lastName')
        .populate('tags', 'name color');

        if (!todo) throw new NotFoundError("Todo not found");

        return res.status(200).json({
            success: true,
            todo: todo
        });
    }
    catch (error) {
        next(error);
    }
}

// =================
// mark as completed
// =================

const markAsCompleted = async (req, res, next) => {
    try {
        const userId = req.user?._id
        const studioId = req.user?.studio
        const { todoId } = req.params

        const todo = await TodoModel.findOneAndUpdate(
            { 
                _id: todoId, 
                studioId: studioId,
                status: { $ne: 'completed' } // Prevent re-completing
            },
            {
                status: 'completed',
                isCompleted: true,
                completedBy: userId,
                completedAt: new Date()
            },
            { new: true }
        )
        .populate('assignees', 'firstName lastName')
        .populate('tags', 'name color');

        if (!todo) throw new NotFoundError("Todo not found or already completed");

        return res.status(200).json({
            success: true,
            todo: todo
        });
    }
    catch (error) {
        next(error)
    }
}

// =================
// mark as canceled
// =================

const markAsCanceled = async (req, res, next) => {
    try {
        const userId = req.user?._id
        const studioId = req.user?.studio
        const { todoId } = req.params

        const todo = await TodoModel.findOneAndUpdate(
            { 
                _id: todoId, 
                studioId: studioId,
                status: { $ne: 'canceled' } // Prevent re-canceling
            },
            {
                status: 'canceled',
                isCanceled: true,
                canceledBy: userId,
                canceledAt: new Date()
            },
            { new: true }
        )
        .populate('assignees', 'firstName lastName')
        .populate('tags', 'name color');

        if (!todo) throw new NotFoundError("Todo not found or already canceled");

        return res.status(200).json({
            success: true,
            todo: todo
        });
    }
    catch (error) {
        next(error)
    }
}

// =================
// Delete Todo
// =================

const deleteTodo = async (req, res, next) => {
    try {
        const studioId = req.user?.studio;
        const { todoId } = req.params;

        const todo = await TodoModel.findOneAndDelete({ 
            _id: todoId, 
            studioId: studioId 
        });

        if (!todo) throw new NotFoundError("Todo not found");

        // Remove task from all assignees
        if (todo.assignees && todo.assignees.length > 0) {
            const bulkOps = todo.assignees.map(staffId => ({
                updateOne: {
                    filter: { _id: staffId },
                    update: { $pull: { tasks: todoId } }
                }
            }));
            await StaffModel.bulkWrite(bulkOps);
        }

        return res.status(200).json({
            success: true,
            message: "Todo deleted successfully"
        });
    }
    catch (error) {
        next(error);
    }
}

module.exports = {
    // tags related controller
    createTags,
    getTags,
    createTodos,
    getTodos,
    getTodoById,
    updateTodo,
    markAsCompleted,
    markAsCanceled,
    deleteTodo
}