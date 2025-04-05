// const express = require('express');
// const router = express.Router();
// const { protect } = require('../middleware/authMiddleware');
// const { 
//   createTask, 
//   getTasks, 
//   updateTask, 
//   deleteTask 
// } = require('../controllers/taskController');

// //router.use(protect); // All task routes require authentication

// router.route('/')
//   .post(createTask)
//   .get(getTasks);

// router.route('/:id')
//   .put(updateTask)
//   .delete(deleteTask);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Ensure this exists
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

router.route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;