import { listAllUsers, addUser, findUserById } from "../models/user-model.js";

const getUser = async (req, res) => {
  res.json(await listAllUsers());
};

const getUserById = async (req, res) => {
  const user = await findUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
};

const postUser = async (req, res) => {
  console.log("postUser", req.body);
  console.log("file", req.file);
  const result = await addUser(req.body);
  if (result.user_id) {
    res.status(201);

    res.json({ message: "New user added.", result });
  } else {
    res.sendStatus(400);
  }
};

const putUser = (req, res) => {
  res.status(200).json({ message: "User updated." });
};

const deleteUser = (req, res) => {
  res.status(200).json({ message: "User deleted." });
};

export { postUser, getUser, getUserById, putUser, deleteUser, addUser };
