import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

import {
  listAllUsers,
  addUser,
  findUserById,
  removeUser,
  modifyUser,
} from "../models/user-model.js";

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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Invalid or missing fields");
    error.status = 400;
    return next(error);
  }
  req.body.password = bcrypt.hashSync(req.body.password, 10);
  const result = await addUser(req.body);
  if (result.user_id) {
    res.status(201);

    res.json({ message: "New user added.", result });
  } else {
    res.sendStatus(400);
  }
};

const putUser = async (req, res) => {
  const result = await modifyUser(req.body, req.params.id, res.locals.user);
  if (result) {
    res.status(200).json({ message: "User item updated." });
  } else {
    res.sendStatus(400);
  }
};

const deleteUser = async (req, res) => {
  const result = await removeUser(req.params.id, res.locals.user);
  if (result) {
    res.status(200).json({ message: "User item deleted." });
  } else {
    res.sendStatus(400);
  }
};

export { postUser, getUser, getUserById, putUser, deleteUser, addUser };
