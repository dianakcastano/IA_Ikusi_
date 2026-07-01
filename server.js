require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { saveSubmission, getAllSubmissions } = require('./database');

const app = express();
const PORT = process.env.PORT || 8080;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ikusiadmin123';

app.use(cors());
app.use(express.json());

// Servir archivos estáticos específicos por seguridad (evita exponer código de servidor)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/logo-ikusi.jpg', (req, res) => {
  res.sendFile(path.join(__dirname, 'logo-ikusi.jpg'));
});

// Middleware de autorización básico para endpoints administrativos
const authorizeAdmin = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token || token !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  next();
};

// Endpoints de la API

// 1. Guardar una nueva iniciativa o tarea
app.post('/api/submit', async (req, res) => {
  try {
    const data = req.body;
    
    // Validación básica de campos requeridos
    if (!data.type || !data.nombre || !data.area) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: type, nombre, area' });
    }
    
    if (data.type !== 'iniciativa' && data.type !== 'tarea') {
      return res.status(400).json({ error: 'El tipo debe ser "iniciativa" o "tarea"' });
    }
    
    const saved = await saveSubmission(data);
    res.status(201).json({ success: true, submission: saved });
  } catch (err) {
    console.error('Error al guardar la respuesta:', err.message);
    res.status(500).json({ error: 'Error interno del servidor al guardar los datos' });
  }
});

// 2. Verificar la contraseña del administrador
app.post('/api/auth', (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Se requiere contraseña' });
  }
  
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Contraseña incorrecta' });
  }
});

// 3. Obtener todas las respuestas (Solo Admin)
app.get('/api/submissions', authorizeAdmin, async (req, res) => {
  try {
    const submissions = await getAllSubmissions();
    res.json({ success: true, submissions });
  } catch (err) {
    console.error('Error al recuperar respuestas:', err.message);
    res.status(500).json({ error: 'Error interno del servidor al recuperar datos' });
  }
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`==================================================`);
  console.log(`Servidor de Cuestionario Ikusi corriendo en:`);
  console.log(`http://localhost:${PORT}`);
  console.log(`Panel administrativo: http://localhost:${PORT}/admin`);
  console.log(`==================================================`);
});
