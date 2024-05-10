import {
  addCat,
  findCatById,
  findCatByOwner,
  listAllCats,
  modifyCat,
  removeCat,
} from "../models/cat-model.js";

const getCat = async (req, res) => {
  res.json(await listAllCats());
};

const getCatById = async (req, res) => {
  const cat = await findCatById(req.params.id);
  if (cat) {
    res.json(cat);
  } else {
    res.sendStatus(404);
  }
};
const getCatByOwner = async (req, res) => {
  const cat = await findCatByOwner(req.params.id);
  if (cat) {
    res.json(cat);
  } else {
    res.sendStatus(404);
  }
};

const postCat = async (req, res) => {
  if (!req.file) {
    const error = new Error("Invalid or missing file");
    error.status = 400;
    next(error);
  }
  const filename = req.file.filename;
  req.body.owner = res.locals.user.user_id;
  const result = await addCat({ ...req.body, filename });
  if (result.error) {
    return next(new Error(result.error));
  }

  res.status(201);

  res.json({ message: "New cat added.", result });
};

const putCat = async (req, res) => {
  const result = await modifyCat(req.body, req.params.id, res.locals.user);

  if (result.error) {
    return next(new Error(result.error));
  }

  res.status(200).json({ message: "Cat item updated." });
};

const deleteCat = async (req, res) => {
  const result = await removeCat(req.params.id, res.locals.user);
  if (result.error) {
    return next(new Error(result.error));
  }
  res.status(200).json({ message: "Cat item deleted." });
};

export { getCat, getCatById, postCat, putCat, deleteCat, getCatByOwner };
