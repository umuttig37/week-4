import promisePool from "../../utils/database.js";

const listAllCats = async () => {
  const [rows] = await promisePool.query(
    "SELECT cats.*, users.name AS owner FROM cats JOIN users ON cats.owner = users.user_id",
  );
  console.log("rows", rows);
  return rows;
};

const findCatById = async (id) => {
  const [rows] = await promisePool.execute(
    "SELECT * FROM cats WHERE cat_id = ?",
    [id],
  );
  console.log("rows", rows);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};
const findCatByOwner = async (id) => {
  const [rows] = await promisePool.execute(
    "SELECT * FROM cats WHERE owner = ?",
    [id],
  );
  console.log("rows", rows);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};
const addCat = async (cat) => {
  const { cat_name, weight, owner, filename, birthdate } = cat;
  const sql = `INSERT INTO cats (cat_name, weight, owner, filename, birthdate)
               VALUES (?, ?, ?, ?, ?)`;
  const params = [cat_name, weight, owner, filename, birthdate];
  const rows = await promisePool.execute(sql, params);
  console.log("rows", rows);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return { cat_id: rows[0].insertId };
};

const modifyCat = async (cat, id) => {
  const sql = promisePool.format(`UPDATE cats SET ? WHERE cat_id = ?`, [
    cat,
    id,
  ]);
  const rows = await promisePool.execute(sql);
  console.log("rows", rows);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return { message: "success" };
};

const removeCat = async (id) => {
  const [rows] = await promisePool.execute(
    "DELETE FROM cats WHERE cat_id = ?",
    [id],
  );
  console.log("rows", rows);
  if (rows.affectedRows === 0) {
    return false;
  }
  return { message: "success" };
};

export {
  listAllCats,
  findCatById,
  addCat,
  modifyCat,
  removeCat,
  findCatByOwner,
};
