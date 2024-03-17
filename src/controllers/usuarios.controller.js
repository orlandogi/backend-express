import { pool } from "../db.js";

// Modificar get
export const getUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT usu.id,usu.strNombreUsuario, usu.strContraseña, tipo.strNombre AS TipoUsuario, estado.strEstado AS Estado FROM usu_usuario usu JOIN usu_cat_tipo_usuario tipo ON usu.idTipoUsuario = tipo.id JOIN usu_cat_estado_usuario estado ON usu.idTipoEstado = estado.id"
    );
    res.json(rows);
  } catch (error) {
    return res.status(500).json({
      message: "Algo salio mal",
    });
  }
};

// Modificar get
export const getUsuario = async (req, res) => {
  try {
    console.log(req.params.id);
    const [rows] = await pool.query(
      "SELECT usu.strNombreUsuario, usu.strContraseña, tipo.strNombre AS TipoUsuario, tipo.strDescripcion AS Descripcion, estado.strEstado AS Estado FROM usu_usuario usu JOIN usu_cat_tipo_usuario tipo ON usu.idTipoUsuario = tipo.id JOIN usu_cat_estado_usuario estado ON usu.idTipoEstado = estado.id where idTipoUsuario = ? ",
      [req.params.id]
    );
    console.log(rows);
    if (rows.length <= 0)
      return res.status(404).json({
        message: "Employee not found",
      });
    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({
      message: "Algo salio mal",
    });
  }
};

export const getDescripcionUsuario = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT strDescripcion FROM usu_cat_tipo_usuario"
      );
    res.json(rows);
  } catch (error) {
    return res.status(500).json({
      message: "Algo salio mal",
    });
  }
};


export const postUsuarios = async (req, res) => {
  try {
    const { strNombreUsuario, strContraseña, idTipoUsuario, idTipoEstado } =
      req.body;
    const [rows] = await pool.query(
      "INSERT INTO usu_usuario (strNombreUsuario, strContraseña,idTipoUsuario,idTipoEstado) VALUES (?,?,?,?)",
      [strNombreUsuario, strContraseña, idTipoUsuario, idTipoEstado]
    );
    res.send({
      idUsuario: rows.idUsuario,
      strNombreUsuario,
      strContraseña,
      idTipoUsuario,
      idTipoEstado,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Algo salio mal",
    });
  }
};

// Modificar Update
export const updateUsuarios = async (req, res) => {
  try {
    const { id } = req.params;
    const { strNombreUsuario, strContraseña, idTipoUsuario, idTipoEstado } = req.body;
    const [result] = await pool.query(
      "update usu_usuario  set strNombreUsuario = ?, strContraseña = ?, idTipoUsuario = ?, idTipoEstado= ? where id = ?",
      [strNombreUsuario, strContraseña, idTipoUsuario, idTipoEstado, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({
        message: "Employee not found",
      });

    const [rows] = await pool.query("Select * from usu_usuario where id = ?", [
      id,
    ]);

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({
      message: "Algo salio mal",
    });
  }
};

// Modificar delete
export const deleteUsuarios = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM usu_usuario where id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows <= 0)
      return res.status(404).json({
        message: "Employee not found",
      });

    console.log(result);
    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({
      message: "Algo salio mal",
    });
  }
};
