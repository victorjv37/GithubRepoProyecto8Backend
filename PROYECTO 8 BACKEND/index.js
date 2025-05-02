const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { connectDB } = require("./src/config/db");
const { configCloudinary } = require("./src/config/cloudinary");
require("dotenv").config();

//Importamos las rutas principales de done vamos a sacar todos los get put post delete
const guitarRoutes = require("./src/api/routes/guitar.routes");
const manufacturerRoutes = require("./src/api/routes/manufacturer.routes");

//Inicio express
const app = express();

//Conectamos base de datos
connectDB();

//Configuro cloudinary
configCloudinary();

//Metemos 4 middles, hay 2 que no nos van a servir por no tener frontend , pero quise adelantamre ya que despues del scrapper tendre 
//mi primer proyecto fullstack, por eso he querido meter el cors que lo uso mucho en la empresa, aunque ahora sea un guarda de seguridad dormido 
//el urlencoded me parsearia los datos tipicos que mandan los formularios html, de momento no lo usamos pero tambien queria meterlo para ver como era
//el fileupload si lo usaremos para el tema de cloudinary

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  })
);

//usamos las rutas que importamos
app.use("/api/v1/guitars", guitarRoutes);
app.use("/api/v1/manufacturers", manufacturerRoutes);

//ruta raiz /, me da mensaje de ok y le pasamos las rutas que acabamos de definir
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Guitar API",
    routes: {
      guitars: "/api/v1/guitars",
      manufacturers: "/api/v1/manufacturers",
    },
  });
});

// empezamos el server en pouerto 3000 (por ejemplo)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 