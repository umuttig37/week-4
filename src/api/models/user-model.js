import promisePool from "../../utils/database.js";

const listAllUsers = async () => {
  const [rows] = await promisePool.query("SELECT * FROM users");
  console.log("rows", rows);
  return rows;
};

const findUserById = async (id) => {
  const [rows] = await promisePool.execute(
    "SELECT * FROM users WHERE cat_id = ?",
    [id],
  );
  console.log("rows", rows);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const addUser = async (user) => {
  const { name, username, email, password, role } = user;
  const sql = `INSERT INTO users (name, username, email, password, role)
               VALUES (?, ?, ?, ?, ?)`;
  const params = [name, username, email, password, role];
  const rows = await promisePool.execute(sql, params);
  console.log("rows", rows);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return { user_id: rows[0].insertId };
};

const removeUser = async (id) => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();
    await promisePool.execute("DELETE FROM cats where owner = ?", [id]);
    const sql = connection.format("DELETE FROM Users WHERE user_id = ?", [id]);
    const [result] = await connection.execute(sql);
    if (result.affectedRows === 0) {
      return {
        message: "User not deleted",
      };
    }
    await connection.commit();
    return { message: "user deleted" };
  } catch (error) {
    await connection.rollback();
    console.error("error", error.message);
    return {
      message: error.message,
    };
  } finally {
    connection.release();
  }
};
export { listAllUsers, findUserById, addUser, removeUser };
