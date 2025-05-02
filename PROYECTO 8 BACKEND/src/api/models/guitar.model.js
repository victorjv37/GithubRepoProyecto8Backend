const mongoose = require("mongoose");

//esquema de la guitarra, el nombre es obligatorio, el precio tambien, la imagen puede estar o no, y el fabricante asociado es obligatorio
//a menos que se fabricara ella misma , lo cual esta dificil asi que vamos a asumir que siempre tiene fabricante

const guitarSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre de la guitarra es obligatorio"],
      //al name le meto trim para que no me molesten los tipicos errores de espacios
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "El precio de la guitarra es obligatorio"],
      //al price le meto min para que no me molesten los precios negativos, por si acaso...
      min: [0, "El precio de la guitarra no puede ser negativo"],
    },
    image: {          
      //con su url y su id para poder buscarla en cloudinary
      url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
    manufacturer: { 
      //el fabricante que hizo la guitarra, lo cogemos por su id y es obligatorio rellenarlo, por lo que tienes que hacer un get antes de los fabricantes
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manufacturer",
      required: [true, "El fabricante es obligatorio"],
    },
  },
  {
    //añadimos los timestamps para saber cuando se creo y eso, nos lo recomienda el profe y me parece util a futuro
    timestamps: true,
    toJSON: {
      //virtuals por si hubiera campos mas complejos en un futuro, y el transform para quitar el v de version
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

//creamos el modelo 
const Guitar = mongoose.model("Guitar", guitarSchema);

//nos lo llevamos al controller
module.exports = Guitar; 