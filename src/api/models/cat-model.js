import promisePool from "../../utils/database.js";

const listAllCats = async () => {
  const [rows] = await promisePool.query(
    "SELECT , users.name AS owner FROM cats JOIN users ON cats.owner = users.user_id",
  );

  return rows;
};

const findCatById = async (id) => {
  const [rows] = await promisePool.execute(
    "SELECT * FROM cats WHERE cat_id = ?",
    [id],
  );

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

  if (rows[0].affectedRows === 0) {
    return false;
  }
  return { cat_id: rows[0].insertId };
};

const modifyCat = async (cat, id, user) => {
  let sql;
  console.log(user.user_id);
  if (user.role === "admin") {
    sql = promisePool.format(`UPDATE cats SET ? WHERE cat_id = ?`, [cat, id]);
  } else {
    sql = promisePool.format(
      `UPDATE cats SET ? WHERE cat_id = ? AND owner = ?`,
      [cat, id, user.user_id],
    );
  }
  const rows = await promisePool.execute(sql);

  if (rows[0].affectedRows === 0) {
    return false;
  }
  return { message: "success" };
};

const removeCat = async (id, user) => {
  const [rows] = await promisePool.execute(
    user.role === "admin"
      ? "DELETE FROM cats WHERE cat_id = ?"
      : "DELETE FROM cats WHERE cat_id = ? AND owner = ?",
    user.role === "admin" ? [id] : [id, user.user_id],
  );

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
