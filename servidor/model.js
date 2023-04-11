const mongoose = require('mongoose')

const mensajeSchema = new mongoose.Schema({
  usuario: {type: String, require: true},
  mensaje: {type: String, require: true},
  date: {type: Date, default: Date.now}
})

const Mensaje = mongoose.model("Mensaje", mensajeSchema);

module.exports = Mensaje;
