const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const Mensaje = require('./models/mensaje'); // Asegúrate que coincide con el nombre de tu archivo en models/

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado exitosamente a MongoDB Compass'))
  .catch((err) => console.error('❌ Error al conectar a MongoDB:', err));

// --- RUTAS DE LA API ---

// 1. Obtener todos los mensajes
app.get('/api/mensajes', async (req, res) => {
  try {
    const mensajes = await Mensaje.find().sort({ fecha: -1 });
    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los mensajes' });
  }
});

// 2. Guardar un nuevo mensaje
app.post('/api/mensajes', async (req, res) => {
  try {
    const { nombre, mensaje } = req.body;
    if (!nombre || !mensaje) {
      return res.status(400).json({ error: 'Nombre y mensaje son requeridos' });
    }

    const nuevoMensaje = new Mensaje({ nombre, mensaje });
    await nuevoMensaje.save();

    res.status(201).json(nuevoMensaje);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el mensaje' });
  }
  
});
// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '..')));

// Ruta raíz para servir index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});