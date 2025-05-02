const fs = require("fs");
const { cloudinary } = require("../config/cloudinary");

//tenemos dos herramientas aqui, ambas relacionadas con cloudinary, una nso sirve para subir los objetos y con la otra los borramos

const uploadToCloudinary = async (filePath, folder) => {
  //recibimoa un path y unA folder
  try { 
    if (!filePath) return null;

    const result = await cloudinary.uploader.upload(filePath, {
      //aqui estamos usando el metodo uploader de cloudinary, le pasamos nuestro path, y luego un objeto que lleva dentro la carpeta,
      //y el resource_type es auto, para que lo detecte solo, asi mos curamos en salud de no estar pendiente del tipo de archivo que viene
      folder: folder,
      resource_type: "auto",
    });

    //borramos el archivo temporal con esta funcion tan util 
    fs.unlinkSync(filePath);

    //devolvemos la url(pone secure solo pq usa https) y el id de la imagen para poder usarlo cd queramos borrarla/actualizarla
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    //en caso de error, borramos el archivo temporal si existe
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.error("Error uploading to Cloudinary:", error);
    return null;
  }
};

//esta es la funcion para borrar la imagen de cloudinary que queramos, solo necesitamos su id
const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return;

    //simplemente usamos el destroy y la identificamos por su id
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return false;
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
}; 

//nos llevamos los metodos a los controllers