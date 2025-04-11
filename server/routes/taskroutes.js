const express = require('express');
const router = express.Router();
const {createTask,removeTask,getTasks} = require('../controllers/taskController');
const {authMiddleware} = require('../middlewares/authMiddleware');


router.post('/add',authMiddleware,createTask);
router.delete('/remove/:id',authMiddleware,removeTask);
router.get('/',authMiddleware,getTasks)

module.exports = router