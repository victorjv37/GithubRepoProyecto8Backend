const mongoose = require("mongoose");

//esta es la conexion a la base de datos con mongoose

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

//nos lo llevamos al index
module.exports = { connectDB }; 