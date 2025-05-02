const Guitar = require("../models/guitar.model");
const Manufacturer = require("../models/manufacturer.model");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../../utils/cloudinary.utils");


//con esto haremos todo el crud de las guitarras, nos traemos las funciones de cloudinary y los dos modelos 

// get de todos los objetos, en este caso guitarras
const getAllGuitars = async (req, res) => {
  try {
    const guitars = await Guitar.find().populate("manufacturer");
    return res.status(200).json(guitars);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener las guitarras",
      error: error.message,
    });
  }
};

// get de una guitarra por su id
const getGuitarById = async (req, res) => {
  try {
    const { id } = req.params;
    const guitar = await Guitar.findById(id).populate("manufacturer");

    if (!guitar) {
      return res.status(404).json({
        message: "Guitarra no encontrada",
      });
    }

    return res.status(200).json(guitar);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener la guitarra",
      error: error.message,
    });
  }
};

//creamos nueva guitarra, los tres campos son obligatorios
const createGuitar = async (req, res) => {
  try {
    const { name, price, manufacturer } = req.body;
    
    if (!name || !price || !manufacturer) {
      return res.status(400).json({
        message: "El nombre, precio y fabricante son obligatorios",
      });
    }

    //si no existe fabricante no hacemos nada, en el readme se incluyen los fabricantes posibles 
    const manufacturerExists = await Manufacturer.findById(manufacturer);
    if (!manufacturerExists) {
      return res.status(404).json({
        message: "El fabricante no existe",
      });
    }

    //le metemos los datos a la guitarra
    const guitarData = {
      name,
      price,
      manufacturer,
      image: { url: "", public_id: "" },
    };

    //para subir la imagen a cloudinary que es lo nuevo de este proyecto:
    //comprobamos que nos hemos cogido la imagen , ya que no es required y podria ser undefined
    if (req.files && req.files.image) {
      //desestructuro la imagen y la guardo en imagepath, la recojo del request obteniendo la ruta local al archivo que express-fileupload ha guardado
      const imagePath = req.files.image.tempFilePath;
      //subimos la imagen usando el image path que nos hemos cogido y la carpeta donde queremos que vaya
      const imageUpload = await uploadToCloudinary(imagePath, "guitars");
      //si imageupload ha salido guay la metemos en la guitarra
      if (imageUpload) {
        guitarData.image = imageUpload;
      }
    }

    //nos guardamos la guitarra en la bd
    const newGuitar = new Guitar(guitarData);
    await newGuitar.save();

    return res.status(201).json(newGuitar);
  } catch (error) {
    return res.status(500).json({
      message: "Error al crear la guitarra",
      error: error.message,
    });
  }
};

//actualizamos la guitarra, todos los campos son opcionales, si no esta relleno simplemente no se cambia
const updateGuitar = async (req, res) => {
  try {
    //nos guardamos todos los campos que nos interesan desestructurando los params y el request para tenerlos preparados
    const { id } = req.params;
    const { name, price, manufacturer } = req.body;

    // Buscamos la guitarra por el id
    const guitar = await Guitar.findById(id);
    if (!guitar) {
      return res.status(404).json({
        message: "Guitarra no encontrada",
      });
    }

    //si se proporciona un fabricante, comprobamos que existe, pq este debe ser uno de los disponibles, que tenemos en el readme
    if (manufacturer) {
      const manufacturerExists = await Manufacturer.findById(manufacturer);
      if (!manufacturerExists) {
        return res.status(404).json({
          message: "El fabricante no existe",
        });
      }
      guitar.manufacturer = manufacturer;
    }

    //actualizamos los datos que nos interesan, le metemos un if a cada variable rapido para comprobar
    if (name) guitar.name = name;
    if (price) guitar.price = price;

    //subimos la imagen nueva a cloud si nso la han pasado
    if (req.files && req.files.image) {
      //eliminamos la imagen anterior primero,( si existia)
      if (guitar.image.public_id) {
        await deleteFromCloudinary(guitar.image.public_id);
      }

      //subimos la nueva imagen con el proceso que explique antes
      const imagePath = req.files.image.tempFilePath;
      const imageUpload = await uploadToCloudinary(imagePath, "guitars");
      
      if (imageUpload) {
        guitar.image = imageUpload;
      }
    }

    //guardamos cambios
    await guitar.save();

    return res.status(200).json(guitar);
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar la guitarra",
      error: error.message,
    });
  }
};

//la mas facil de las llamadas, cogemos la guitarra y la expulsamos de nuestra base de datos, por traidora
const deleteGuitar = async (req, res) => {
  try {
    const { id } = req.params;

    //buscamos a la traidora por su dni
    const guitar = await Guitar.findById(id);
    if (!guitar) {
      return res.status(404).json({
        message: "Guitarra no encontrada",
      });
    }

    //muy importante borrar la imagen de cloudinary asociada a la guitarra para no ocupar espacio innecesarip (y cumplir los requisitos del proyetco)
    if (guitar.image.public_id) {
      await deleteFromCloudinary(guitar.image.public_id);
    }

    //bye bye guitarra
    await Guitar.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Guitarra eliminada correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar la guitarra",
      error: error.message,
    });
  }
};

//nos llevamos todas estas funciones a la guitar routes
module.exports = {
  getAllGuitars,
  getGuitarById,
  createGuitar,
  updateGuitar,
  deleteGuitar,
}; 