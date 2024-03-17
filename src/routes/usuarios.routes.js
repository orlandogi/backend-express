import { Router } from "express";
import {getUsuarios,getUsuario, postUsuarios, updateUsuarios,deleteUsuarios, getDescripcionUsuario } from "../controllers/usuarios.controller.js";

const router = Router()

//
router.get('/usuarios',getUsuarios)

router.get('/usuario/:id',getUsuario)

router.get('/tipoUsuario', getDescripcionUsuario)

router.post('/usuario',postUsuarios)

router.put('/usuario/:id', updateUsuarios)

router.delete('/usuario/:id', deleteUsuarios)

export default router;