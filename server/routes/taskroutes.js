const express = require('express');
const router = express.Router();
const {createTask,removeTask,getTasks, generateSubTask, findTask, regenerateSubTask, recentTasks, updateTask} = require('../controllers/taskController');
const {authMiddleware} = require('../middlewares/authMiddleware');


router.post('/add',authMiddleware,createTask);
router.delete('/remove/:id',authMiddleware,removeTask);
router.get('/',authMiddleware,getTasks)
router.put('/regenrate-SubTasks',authMiddleware,regenerateSubTask);
router.get('/getTask/:id',authMiddleware,findTask);
router.get('/getRecentTasks',authMiddleware,recentTasks);
router.put('/updateTask',authMiddleware,updateTask);

module.exports = router