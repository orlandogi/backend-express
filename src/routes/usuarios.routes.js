import { Router } from "express";
import {getUsuarios,getUsuario, postUsuarios, updateUsuarios,deleteUsuarios, getDescripcionUsuario, 
  postPelicula, getPelicula, getGenero, getPeliculas, deletePelicula, updatePelicula, 
  getPeliculasDisponibles, publicarPelicula, getPeliculasPublicadas, deletePeliculaPublicada, postTicket,
  getTickets, deleteTickets, updateTicket } 
  from "../controllers/usuarios.controller.js";
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

router.get('/peliculas', getPeliculas)

router.post('/pelicula', upload.single('imagen'), postPelicula);

router.get('/pelicula/:id', getPelicula);

router.get('/genero', getGenero);

router.delete('/pelicula/:id', deletePelicula)

router.put('/pelicula/:id',upload.single('imagen'), updatePelicula)

router.get('/peliculasDisponibles', getPeliculasDisponibles)

router.post('/uploadMovie', publicarPelicula)

router.get('/uploadMovies', getPeliculasPublicadas)

router.delete('/uploadMoviePublish/:id', deletePeliculaPublicada)

router.post('/ticket', postTicket)

router.get('/tickets', getTickets)

router.delete('/ticket/:id', deleteTickets)

router.put('/ticket/:id', updatePelicula)

export default router;