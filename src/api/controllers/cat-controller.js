import {
  addCat,
  findCatById,
  findCatByOwner,
  listAllCats,
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
  console.log("TEST");
  console.log(req.params);
  const cat = await findCatByOwner(req.params.id);
  if (cat) {
    res.json(cat);
  } else {
    res.sendStatus(404);
  }
};

const postCat = async (req, res) => {
  console.log("postCat", req.body);
  console.log("file", req.file);
  const filename = req.file.filename;
  const result = await addCat({ ...req.body, filename });
  if (result.cat_id) {
    res.status(201);

    res.json({ message: "New cat added.", result });
  } else {
    res.sendStatus(400);
  }
};

const putCat = async (req, res) => {
  res.status(200).json({ message: "Cat updated." });
};

const deleteCat = async (req, res) => {
  await removeCat(req.cat_id);
  res.status(200).json({ message: "Cat deleted." });
};

export { getCat, getCatById, postCat, putCat, deleteCat, getCatByOwner };
