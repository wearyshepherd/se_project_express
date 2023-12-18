const router = require('express').Router();
const authMiddleware = require('../middlewares/auth');

const { createItem, getItems, deleteItem, likeItem, unlikeItem } = require('../controllers/clothingItem');

// CRUD


// Create
router.post('/', authMiddleware, createItem);

// Read
router.get('/', getItems);

// Delete
router.delete('/:itemId', authMiddleware, deleteItem);

// Like
router.put('/:itemId/likes', authMiddleware, likeItem);

// Unlike
router.delete('/:itemId/likes', authMiddleware, unlikeItem);

module.exports = router;