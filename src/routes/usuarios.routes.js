import { Router } from "express";
import {getUsuarios,getUsuario, postUsuarios, updateUsuarios,deleteUsuarios } from "../controllers/usuarios.controller.js";

const router = Router()

//
router.get('/usuarios',getUsuarios)

router.get('/usuario/:id',getUsuario)

router.post('/usuario',postUsuarios)

router.patch('/usuario/:id', updateUsuarios)

router.delete('/usuario/:id', deleteUsuarios)

export default router;