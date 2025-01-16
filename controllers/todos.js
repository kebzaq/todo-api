const ToDo = require("../models/ToDo");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllToDos = async (req, res) => {
  res.send("get all jobs");
};

const getToDo = async (req, res) => {
  res.send("get all todos");
};
const createToDo = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const todo = await ToDo.create(req.body);
  res.status(StatusCodes.CREATED).json({ todo });
};
const updateToDo = async (req, res) => {
  res.send("get all todos");
};
const deleteToDo = async (req, res) => {
  res.send("get all todos");
};

module.exports = { getAllToDos, getToDo, createToDo, updateToDo, deleteToDo };
