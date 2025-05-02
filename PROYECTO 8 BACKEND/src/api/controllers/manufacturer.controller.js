const Manufacturer = require("../models/manufacturer.model");
const Guitar = require("../models/guitar.model");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../../utils/cloudinary.utils");

//con esto haremos todo el crud de los fabricantes, nos traemos las funciones de cloudinary y los dos modelos, al igual que con las guitarras
//lo unico de los fabricantes es en el delete, que antes de eliminar el fabricante, debe comprobar que no tiene guitarras asociadas

// get de todos los fabricantes
const getAllManufacturers = async (req, res) => {
  try {
    const manufacturers = await Manufacturer.find();
    return res.status(200).json(manufacturers);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener los fabricantes",
      error: error.message,
    });
  }
};

// getfabricante por su id
const getManufacturerById = async (req, res) => {
  try {
    const { id } = req.params;
    const manufacturer = await Manufacturer.findById(id);

    if (!manufacturer) {
      return res.status(404).json({
        message: "Fabricante no encontrado",
      });
    }

    return res.status(200).json(manufacturer);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el fabricante",
      error: error.message,
    });
  }
};

// GET - Obtener guitarras de un fabricante por ID
const getManufacturerGuitars = async (req, res) => {
  try {
    const { id } = req.params;
    // esta operación es asíncrona porque implica una consulta a la bd y eso tarda un poco
    const manufacturer = await Manufacturer.findById(id);

    if (!manufacturer) {
      return res.status(404).json({
        message: "Fabricante no encontrado",
      });
    }

    //buscamos las guitarras que tienen el id de nuestro fabricante
    const guitars = await Guitar.find({ manufacturer: id });
    return res.status(200).json(guitars);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener las guitarras del fabricante",
      error: error.message,
    });
  }
};

// creamos nuevo fabricante, los dos campos son obligatorios tanto name como location, la imagen no he querido ponerla obligatoria por si la 
//empresa es nueva y no tiene logo aun...

const createManufacturer = async (req, res) => {
  try {
    const { name, location } = req.body;
    
    //validamos los required
    if (!name || !location) {
      return res.status(400).json({
        message: "El nombre y la ubicación son obligatorios",
      });
    }

    //iniciamos el objeto de los datos de la empresa
    const manufacturerData = {
      name,
      location,
      logo: { url: "", public_id: "" },
    };

    //comprobamos si tenemos logo, si no hay pues no se rellena y ya esta
    if (req.files && req.files.logo) {
      const logoPath = req.files.logo.tempFilePath;
      const logoUpload = await uploadToCloudinary(logoPath, "manufacturers");
      
      if (logoUpload) {
        manufacturerData.logo = logoUpload;
      }
    }

    //guardamos partida
    const newManufacturer = new Manufacturer(manufacturerData);
    await newManufacturer.save();

    return res.status(201).json(newManufacturer);
  } catch (error) {
    return res.status(500).json({
      message: "Error al crear el fabricante",
      error: error.message,
    });
  }
};

//actualizamos el fabricante, todos los campos son opcionales, si no esta relleno simplemente no se cambia
const updateManufacturer = async (req, res) => {
  try {
    //nos guardamos todos los campos que nos interesan desestructurando como smp
    const { id } = req.params;
    const { name, location } = req.body;

    //buscamos el fabricante por su id
    const manufacturer = await Manufacturer.findById(id);
    if (!manufacturer) {
      return res.status(404).json({
        message: "Fabricante no encontrado",
      });
    }

    // actualizamos lo que haya
    if (name) manufacturer.name = name;
    if (location) manufacturer.location = location;

    //si hay logo nuevo
    if (req.files && req.files.logo) {
      //eliminamos el anterior logicamente
      if (manufacturer.logo.public_id) {
        await deleteFromCloudinary(manufacturer.logo.public_id);
      }

      //subimos logo nuevo 
      const logoPath = req.files.logo.tempFilePath;
      const logoUpload = await uploadToCloudinary(logoPath, "manufacturers");
      
      if (logoUpload) {
        manufacturer.logo = logoUpload;
      }
    }

    //guardamos cambios
    await manufacturer.save();

    return res.status(200).json(manufacturer);
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar el fabricante",
      error: error.message,
    });
  }
};

// eliminamos el fabricante, antes de eliminar el fabricante, no puede tener guitarras asociadas
const deleteManufacturer = async (req, res) => {
  try {
    const { id } = req.params;

    const manufacturer = await Manufacturer.findById(id);
    if (!manufacturer) {
      return res.status(404).json({
        message: "Fabricante no encontrado",
      });
    }

    //comprobamos si hay guitarras asociadas aqui
    const guitarCount = await Guitar.countDocuments({ manufacturer: id });
    if (guitarCount > 0) {
      return res.status(400).json({
        message: "No se puede eliminar el fabricante porque tiene guitarras asociadas",
      });
    }

    //eliminamos el logo de cloudinary tambien , si existe
    if (manufacturer.logo.public_id) {
      await deleteFromCloudinary(manufacturer.logo.public_id);
    }

    //eliminamos el fabricante
    await Manufacturer.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Fabricante eliminado correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar el fabricante",
      error: error.message,
    });
  }
};

//nos llevamos esto también a routes
module.exports = {
  getAllManufacturers,
  getManufacturerById,
  getManufacturerGuitars,
  createManufacturer,
  updateManufacturer,
  deleteManufacturer,
}; 