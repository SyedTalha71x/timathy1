const express = require('express')
const {
    // Tags controllers
    createTags,
    getTags,
    // getTagById,
    // updateTag,
    // deleteTag,

    // Todo controllers
    createTodos,
    getTodos,
    getTodoById,
    updateTodo,
    markAsCompleted,
    markAsCanceled,
    deleteTodo
} = require('../controllers/TodoController')
const { verifyAccessToken } = require('../middleware/verifyToken')

const router = express.Router()

// Protect all routes
router.use(verifyAccessToken)

// ========== Todo Routes ============

router.post('/create', createTodos)  // Create todo
router.get("/all", getTodos)       // Get all todos

router.delete('/:todoId', deleteTodo)   // Delete todo
router.put('/:todoId', updateTodo)      // Update todo
router.get('/:todoId', getTodoById)    // Get single todo

// Todo status updates
router.patch('/:todoId/completed', markAsCompleted)
router.patch('/:todoId/canceled', markAsCanceled)

// ========== Tags Routes ============
router.post('/tags/create', createTags)
router.get('/tags/all', getTags)



module.exports = router