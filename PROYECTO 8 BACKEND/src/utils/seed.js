const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Manufacturer = require("../api/models/manufacturer.model");
const Guitar = require("../api/models/guitar.model");
const { uploadToCloudinary } = require("./cloudinary.utils");
const { configCloudinary } = require("../config/cloudinary");
require("dotenv").config();

//creamos los datos, esto parecia simple, pero he tenido problemas porque claro, habia que tener antes guardaadas las imagenes para 
//tenerlas disponibles para subirlas a la seed, por no crear datos vacios, esta logica se me atraganto un poco pero al final salió

//creamos el array de los fabricantes (sin las fotos)
const manufacturers = [
  {
    name: "Alhambra",
    location: "Alicante, España",
  },
  {
    name: "Ramírez",
    location: "Madrid, España",
  },
  {
    name: "Conde Hermanos",
    location: "Madrid, España",
  },
];

const seedDatabase = async () => {
  try {
    // Configurar Cloudinary
    configCloudinary();
    
    //nos conectamos a la base de datos
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conexión a MongoDB establecida para el seeding");

    //borramos los datos que habia por si acaso
    await Manufacturer.deleteMany({});
    await Guitar.deleteMany({});
    console.log("Datos previos eliminados");

    //inicializamos array para guardar los fabricantes
    const manufacturersData = [];
    
    for (const manufacturer of manufacturers) {
      let logoPath;
      //creo una variable llamada logopath
      
      //evaluo que nombre tiene el fabricante, segun el que sea, le meto el path que me interesa, esto no me gusta mucho pero no tengo tiempo 
      //apra cambiarlo, no me gusta porque no es dinamico, es meterle el path especifico

      if (manufacturer.name === "Alhambra") {
        logoPath = path.join(__dirname, "../assets/manufacturers/logoAlhambra.jpg");
      } else if (manufacturer.name === "Ramírez") {
        logoPath = path.join(__dirname, "../assets/manufacturers/logoRamirez.jpg");
      } else if (manufacturer.name === "Conde Hermanos") {
        logoPath = path.join(__dirname, "../assets/manufacturers/logoConde.jpg");
      }
      
      //compruebo que el archivo existe con la libreria de fs
      if (fs.existsSync(logoPath)) {
        //si existe, lo subo 
        const logoUpload = await uploadToCloudinary(logoPath, "manufacturers");
        //y fusionamos la info que teniamos del fabricsante con la foto ya subida en cloudinary
        manufacturersData.push({
          ...manufacturer,
          logo: logoUpload
        });
      } else {
        //si no existe, lo meto en el array de fabricantes igual pero con la info de la foto vacia
        manufacturersData.push({
          ...manufacturer,
          logo: { url: "", public_id: "" }
        });
      }
    }

    //creamos los fabricantes con el array final
    const createdManufacturers = await Manufacturer.insertMany(manufacturersData);
    console.log(`${createdManufacturers.length} fabricantes creados`);

    //inicializo el array para guardar las guitarras
    const guitars = [];

    for (const manufacturer of createdManufacturers) {
      //creamos 2 guitarras por fabricante, le meto el precio con un random para que varie un poco, las imagenes no las voy a variar 


      //lo mismo, guardamos paths de las imagenes
      const classicGuitarPath = path.join(__dirname, "../assets/guitars/guitarraClasica.jpg");
      const flamencoGuitarPath = path.join(__dirname, "../assets/guitars/guitarraFlamenca.jpg");
      
      //creamos un mini Model 
      let classicImage = { url: "", public_id: "" };
      let flamencoImage = { url: "", public_id: "" };
      
      //compruebo que el archivo existe, si existe,lo subimos
      if (fs.existsSync(classicGuitarPath)) {
        classicImage = await uploadToCloudinary(classicGuitarPath, "guitars");
      }
      
      if (fs.existsSync(flamencoGuitarPath)) {
        flamencoImage = await uploadToCloudinary(flamencoGuitarPath, "guitars");
      }
      
      //ahora con los datos que ya tenemos los insertamos en el array de guitarras, asi por cada fabricante
      guitars.push(
        {
          name: `Modelo Clásico ${manufacturer.name}`,
          price: 1200 + Math.floor(Math.random() * 800),
          manufacturer: manufacturer._id,
          image: classicImage,
        },
        {
          name: `Modelo Flamenco ${manufacturer.name}`,
          price: 1500 + Math.floor(Math.random() * 1000),
          manufacturer: manufacturer._id,
          image: flamencoImage,
        }
      );
    }

    const createdGuitars = await Guitar.insertMany(guitars);
    //con la funcion insertmany le metemos el array de ñas guitarras actualizado con los fabricantes
    console.log(`${createdGuitars.length} guitarras creadas`);

    console.log("Base de datos poblada con éxito");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error al poblar la base de datos:", error);
    process.exit(1);
  }
};

seedDatabase(); 