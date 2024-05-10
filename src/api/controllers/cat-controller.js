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
  const filename = req.file.filename;
  req.body.owner = res.locals.user.user_id;
  const result = await addCat({ ...req.body, filename });
  if (result.cat_id) {
    res.status(201);

    res.json({ message: "Cat added.", result });
  } else {
    res.sendStatus(400);
  }
};

const putCat = async (req, res) => {
  const result = await modifyCat(req.body, req.params.id, res.locals.user);
  if (result) {
    res.status(200).json({ message: "Cat updated." });
  } else {
    res.sendStatus(400);
  }
};

const deleteCat = async (req, res) => {
  const result = await removeCat(req.params.id, res.locals.user);
  if (result) {
    res.status(200).json({ message: "Cat deleted." });
  } else {
    res.sendStatus(404);
  }
};

export { getCat, getCatById, postCat, putCat, deleteCat, getCatByOwner };
