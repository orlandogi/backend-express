import { Router } from "express";
import {getUsuarios,getUsuario, postUsuarios, updateUsuarios,deleteUsuarios, getDescripcionUsuario, postPelicula, getPelicula, getGenero } from "../controllers/usuarios.controller.js";
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); 
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  }
});

const upload = multer({ storage: storage });
const router = Router()

//
router.get('/usuarios',getUsuarios)

router.get('/usuario/:id',getUsuario)

router.get('/tipoUsuario', getDescripcionUsuario)

router.post('/usuario',postUsuarios)

router.put('/usuario/:id', updateUsuarios)

router.delete('/usuario/:id', deleteUsuarios)

router.post('/pelicula', upload.single('imagen'), postPelicula);

router.get('/pelicula/:id', getPelicula);

router.get('/genero', getGenero);

export default router;