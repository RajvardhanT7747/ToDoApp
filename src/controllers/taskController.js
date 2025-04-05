// const prisma = require('../config/database');

// // @desc    Create a new task
// // @route   POST /api/tasks
// // @access  Private
// const createTask = async (req, res) => {
//   try {
//     const { title, description } = req.body;

//     if (!title) {
//       return res.status(400).json({ message: 'Please provide a title for the task' });
//     }

//     const task = await prisma.task.create({
//       data: {
//         title,
//         description,
//         userId: req.user.id,
//       },
//     });

//     res.status(201).json(task);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // @desc    Get all tasks for a user
// // @route   GET /api/tasks
// // @access  Private
// const getTasks = async (req, res) => {
//   try {
//     const tasks = await prisma.task.findMany({
//       where: {
//         userId: req.user.id,
//       },
//       orderBy: {
//         updatedAt: 'desc',
//       },
//     });

//     res.json(tasks);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // @desc    Update a task
// // @route   PUT /api/tasks/:id
// // @access  Private
// const updateTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, description, completed } = req.body;

//     // Check if task exists
//     const task = await prisma.task.findUnique({
//       where: { id },
//     });

//     if (!task) {
//       return res.status(404).json({ message: 'Task not found' });
//     }

//     // Check if user owns the task
//     if (task.userId !== req.user.id) {
//       return res.status(401).json({ message: 'Not authorized' });
//     }

//     // Update the task
//     const updatedTask = await prisma.task.update({
//       where: { id },
//       data: {
//         title: title || task.title,
//         description: description !== undefined ? description : task.description,
//         completed: completed !== undefined ? completed : task.completed,
//       },
//     });

//     res.json(updatedTask);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // @desc    Delete a task
// // @route   DELETE /api/tasks/:id
// // @access  Private
// const deleteTask = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Check if task exists
//     const task = await prisma.task.findUnique({
//       where: { id },
//     });

//     if (!task) {
//       return res.status(404).json({ message: 'Task not found' });
//     }

//     // Check if user owns the task
//     if (task.userId !== req.user.id) {
//       return res.status(401).json({ message: 'Not authorized' });
//     }

//     // Delete the task
//     await prisma.task.delete({
//       where: { id },
//     });

//     res.json({ message: 'Task removed' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = {
//   createTask,
//   getTasks,
//   updateTask,
//   deleteTask,
// };


const prisma = require('../config/database');

// @desc    Get all tasks for a user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const task = await prisma.task.create({
      data: {
        title,  // This is now guaranteed to exist
        description: description || "", // Optional field with default
        user: {
          connect: {
            id: req.user.id  // Using the authenticated user's ID
          }
        }
      }
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Task creation error:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    // Verify task belongs to user
    const task = await prisma.task.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: title || task.title,
        description: description !== undefined ? description : task.description,
        completed: completed !== undefined ? completed : task.completed
      }
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify task belongs to user
    const task = await prisma.task.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await prisma.task.delete({
      where: { id }
    });

    res.status(200).json({ message: 'Task removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};