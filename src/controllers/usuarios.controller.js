import { pool } from "../db.js";
import multer from 'multer'; 
import fs from 'fs'; 

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
      "SELECT strNombreUsuario, strContraseña, idTipoUsuario, idTipoEstado FROM usu_usuario WHERE id = ?",
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
    const { strNombreUsuario, strContraseña, idTipoUsuario, idTipoEstado } = req.body;

    // Llamar al stored procedure
    const [result] = await pool.query('CALL InsertarUsuario(?, ?, ?, ?, @message)', [strNombreUsuario, strContraseña, idTipoUsuario, idTipoEstado]);

    // Obtener el mensaje del stored procedure
    const [rows] = await pool.query('SELECT @message AS message');
    const message = rows[0].message;

    res.send({
      message: message,
      strNombreUsuario,
      strContraseña,
      idTipoUsuario,
      idTipoEstado,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Algo salió mal",
      error: error.message
    });
  }
};



// Modificar Update
export const updateUsuarios = async (req, res) => {
  try {
    const { id } = req.params;
    const { strNombreUsuario, strContraseña, idTipoUsuario, idTipoEstado } = req.body;
    const [result] = await pool.query(
      "CALL ActualizarUsuario(?, ?, ?, ?,?, @message)",
      [id, strNombreUsuario, strContraseña, idTipoUsuario, idTipoEstado]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({
        message: "No se encontro el usuario",
      });

    const [rows] = await pool.query('SELECT @message AS message');
    const message = rows[0].message;


    res.send({
      message: message,
      strNombreUsuario,
      strContraseña,
      idTipoUsuario,
      idTipoEstado,
    });  } catch (error) {
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
        message: "No se encontro el usuario",
      });

 
    res.send({
      message: 'Se elimino correctamente'
      
    })
  } catch (error) {
    return res.status(500).json({
      message: "Algo salio mal",
    });
  }
};


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); 
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  }
});

const upload = multer({ storage: storage });

export const postPelicula = async (req, res) => {
  try {
    const { strNombre, strSinopsis, intDuracion, idEstadoPelicula, generos } = req.body;
    
    const imageData = fs.readFileSync(req.file.path);
    const imageBuffer = Buffer.from(imageData);

    const [result1] = await pool.query('SELECT strNombre FROM peli_peliculas where strNombre = ?', [strNombre]);
    if(result1.length == 0){
      const [result] = await pool.query('INSERT INTO peli_peliculas (strNombre, strSinopsis, intDuracion, bloImagen, idEstadoPelicula) VALUES (?, ?, ?, ?, ?)', [strNombre, strSinopsis, intDuracion, imageBuffer, idEstadoPelicula]);

      const idPelicula = result.insertId;
  
      for (const idGenero of generos) {
        await pool.query('INSERT INTO peli_generos (idPelicula, idGeneroPelicula) VALUES (?, ?)', [idPelicula, idGenero]);
      }
      res.status(200).json({ message: 'Película insertada exitosamente' });
    }else{
      return res.status(500).json({ message: 'Error al insertar la película' });
    }

    

  } catch (error) {
    console.error(error);
  }
};

export const getGenero = async (req, res) => {
  const { genero } = req.query;

  try {
    // Consulta SQL para obtener el ID del género basado en el nombre
    const [result] = await pool.query('SELECT id FROM peli_cat_genero WHERE strGenero = ?', [genero]);

    if (result.length === 0) {
      // Si no se encuentra ningún género con ese nombre, devuelve un código de estado 404
      return res.status(404).json({ message: 'Género no encontrado' });
    }

    const { id } = result[0];
    res.json({ id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar el género' });
  }
};

export const getPelicula = async (req, res) => {
  try {
      const { id } = req.params;
      
      // Consulta para obtener la imagen de la película por su ID
      const [result] = await pool.query('SELECT bloImagen FROM peli_peliculas WHERE id = ?', [id]);

      // Si no se encuentra la película con el ID especificado
      if (result.length === 0) {
          return res.status(404).send('No se encontró ninguna película con el ID especificado');
      }

      // Selecciona la imagen de la fila obtenida
      const { bloImagen } = result[0];
      
      // Envía la imagen al cliente
      res.set('Content-Type', 'image'); // Ajusta el tipo de contenido según sea necesario
      res.send(bloImagen);

  } catch (error) {
      console.error('Error al obtener la imagen de la película:', error);
      res.status(500).send('Error interno del servidor');
  }
};