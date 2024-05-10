import promisePool from "../../utils/database.js";

const listAllUsers = async () => {
  const [rows] = await promisePool.query("SELECT * FROM users");

  return rows;
};

const findUserById = async (id) => {
  const [rows] = await promisePool.execute(
    "SELECT * FROM users WHERE cat_id = ?",
    [id],
  );

  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};
const modifyUser = async (user, id, auth) => {
  const sql = promisePool.format(
    `UPDATE users SET ? WHERE user_id = ? AND user_id = ?`,
    [user, id, auth.user_id],
  );
  const rows = await promisePool.execute(sql);

  if (rows[0].affectedRows === 0) {
    return false;
  }
  return { message: "success" };
};
const addUser = async (user) => {
  const { name, username, email, password } = user;
  const sql = `INSERT INTO users (name, username, email, password)
               VALUES (?, ?, ?, ?)`;
  const params = [name, username, email, password];
  const rows = await promisePool.execute(sql, params);

  if (rows[0].affectedRows === 0) {
    return false;
  }
  return { user_id: rows[0].insertId };
};

const removeUser = async (id, user) => {
  if (id === user.user_id || user.role === "admin") {
    const connection = await promisePool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.execute("DELETE FROM cats where owner = ?", [id]);
      const sql = connection.format("DELETE FROM users WHERE user_id = ?", [
        id,
      ]);
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
      return {
        message: error.message,
      };
    } finally {
      connection.release();
    }
  } else {
    return {
      message: "Unauthorized access",
    };
  }
};
const getUserByUsername = async (user) => {
  const rows = await promisePool.execute(
    `SELECT *
            FROM users
            WHERE username = ?`,
    [user],
  );
  if (rows.length === 0) {
    return false;
  }
  return rows[0][0];
};
export {
  listAllUsers,
  findUserById,
  addUser,
  removeUser,
  modifyUser,
  getUserByUsername,
};
