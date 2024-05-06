import { listAllUsers, addUser, findUserById } from "../models/user-model.js";

const getUser = (req, res) => {
  res.json(listAllUsers());
};

const getUserById = (req, res) => {
  const user = findUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
};

const postUser = (req, res) => {
  const result = addUser(req.body);
  if (result.user_id) {
    res.status(201);
    res.json({ message: "New user added.", result });
  } else {
    res.sendStatus(400);
  }
};

const putUser = (req, res) => {
  res.json({ message: "User updated." });
  res.sendStatus(200);
};

const deleteUser = (req, res) => {
  res.json({ message: "User deleted." });
  res.sendStatus(200);
};

export { postUser, getUser, getUserById, putUser, deleteUser, addUser };
