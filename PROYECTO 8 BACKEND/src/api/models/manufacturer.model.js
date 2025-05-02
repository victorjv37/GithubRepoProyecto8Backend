const mongoose = require("mongoose");

const manufacturerSchema = new mongoose.Schema(
  {
    //el nombre es obligatorio, la ubicación tambien, y la imagen puede estar o no
    name: {
      type: String,
      required: [true, "El nombre del fabricante es obligatorio"],
      //el trim es importante
      trim: true,
    },
    location: {
      type: String,
      required: [true, "La ubicación del fabricante es obligatoria"],
      //el trim es importante aqui tambien... kit de supervivencia
      trim: true,
    },
    logo: {
      //misma logica que en la guitarra 
      url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

//definimos la relacion con las guitarras, one to many
manufacturerSchema.virtual("guitars", {
  ref: "Guitar",
  localField: "_id",
  foreignField: "manufacturer",
});

const Manufacturer = mongoose.model("Manufacturer", manufacturerSchema);

module.exports = Manufacturer; 