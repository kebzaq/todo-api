const ToDo = require("../models/ToDo");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

// GET ALL TODOS
const getAllToDos = async (req, res) => {
  const todos = await ToDo.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ todos, count: todos.length });
};
// GET SINGLE TODO
const getToDo = async (req, res) => {
  const {
    user: { userId },
    params: { id: todoId },
  } = req;
  const todo = await ToDo.findOne({ _id: todoId, createdBy: userId });

  if (!todo) {
    throw new NotFoundError(`No todo found with id: ${todoId}`);
  }
  res.status(StatusCodes.OK).json({ todo });
};
// CREATE TODO
const createToDo = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const todo = await ToDo.create(req.body);
  res.status(StatusCodes.CREATED).json({ todo });
};
//UPDATE TODO
const updateToDo = async (req, res) => {
  const {
    body: { title, description },
    user: { userId },
    params: { id: todoId },
  } = req;
  if (!title || !description) {
    throw new BadRequestError("Title or Description fields cannot be empty");
  }
  const todo = await ToDo.findByIdAndUpdate(
    { _id: todoId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!todo) {
    throw new NotFoundError(`No todo task found with id: ${todoId}`);
  }
  res.status(StatusCodes.OK).json({ todo });
};
const deleteToDo = async (req, res) => {
  const {
    user: { userId },
    params: { id: todoId },
  } = req;
  const todo = await ToDo.findOneAndRemove({ _id: todoId, createdBy: userId });
  if (!todo) {
    throw new NotFoundError(`No todo task found with id: ${todoId}`);
  }
  res.status(StatusCodes.NO_CONTENT).send();
};

module.exports = { getAllToDos, getToDo, createToDo, updateToDo, deleteToDo };
