const express = require("express");
const router = express.Router();
const {
  getAllManufacturers,
  getManufacturerById,
  getManufacturerGuitars,
  createManufacturer,
  updateManufacturer,
  deleteManufacturer,
} = require("../controllers/manufacturer.controller");

//lo mismito que las guitarras

router.get("/", getAllManufacturers);

router.get("/:id", getManufacturerById);

router.get("/:id/guitars", getManufacturerGuitars);

router.post("/", createManufacturer);

router.put("/:id", updateManufacturer);

router.delete("/:id", deleteManufacturer);

module.exports = router; 