const express = require("express");
const router = express.Router();

const {
  getAllToDos,
  getToDo,
  createToDo,
  updateToDo,
  deleteToDo,
} = require("../controllers/todos");

router.route("/").post(createToDo).get(getAllToDos);
router.route("/:id").get(getToDo).delete(deleteToDo).patch(updateToDo);

module.exports = router;
