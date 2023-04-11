const mongoose = require('mongoose');

const conectarDB = async () => {
  try{
    await mongoose.connect("mongodb+srv://Jkeviin:Jkeviin2130@cluster0.ovudi9t.mongodb.net/chat", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  }catch (error) {
    console.error("Error al conectarse a la base de datos", error);
    process.exit(1);
  }
}

module.exports = conectarDB;