const express = require("express");
const router = express.Router();
const {
  getAllGuitars,
  getGuitarById,
  createGuitar,
  updateGuitar,
  deleteGuitar,
} = require("../controllers/guitar.controller");

//este es facil , simplemente nos traemos las funciones del controller y le asignamos una ruta,
//la ruta del primer get no es / sino la principal definida en index. las demas parten de ahi,
//las que llevan :/id es pq cogeremos el id de la url para hacer la query

router.get("/", getAllGuitars);

router.get("/:id", getGuitarById);

router.post("/", createGuitar);

router.put("/:id", updateGuitar);

router.delete("/:id", deleteGuitar);

module.exports = router; 