import express from "express";
import UsuariosRoutes from "./routes/usuarios.routes.js";
import cors from "cors";
import morgan from "morgan";



const app = express()

app.use(morgan("dev"));
app.use(express.json())
app.use(cors())

app.use('/api', UsuariosRoutes)

app.use((req, res) =>{
    res.status(404).json({
        message: 'Algo salio mal'
    })
})

export default app;
