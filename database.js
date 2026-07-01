const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, 'ikusi_cuestionario.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos SQLite:', err.message);
  } else {
    console.log('Conectado con éxito a la base de datos SQLite:', dbPath);
    initDatabase();
  }
});

function initDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL, -- 'iniciativa' o 'tarea'
      nombre TEXT NOT NULL,
      area TEXT NOT NULL,
      email TEXT,
      
      -- Campos específicos de 'iniciativa' (PDF)
      iniciativa_nombre TEXT,
      iniciativa_estado TEXT,
      iniciativa_impacto TEXT,
      iniciativa_destinatario TEXT,
      iniciativa_tipo_tech TEXT,
      iniciativa_problema TEXT,
      iniciativa_solucion TEXT,
      iniciativa_beneficio TEXT,
      iniciativa_ahorro_segundos INTEGER,
      iniciativa_usuarios_estimados INTEGER,
      iniciativa_componentes TEXT, -- Almacenado como JSON o texto separado por comas
      iniciativa_fuentes TEXT, -- Almacenado como JSON o texto separado por comas
      
      -- Campos específicos de 'tarea' (HTML)
      tarea_tipo TEXT,
      tarea_frecuencia TEXT,
      tarea_duracion TEXT,
      tarea_unidad TEXT,
      tarea_tiene_idea TEXT,
      tarea_idea_nombre TEXT,
      tarea_idea_descripcion TEXT,
      tarea_idea_estado TEXT,
      tarea_idea_herramienta TEXT,
      tarea_participacion TEXT,
      
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error al crear la tabla submissions:', err.message);
    } else {
      console.log('Tabla submissions inicializada correctamente.');
    }
  });
}

// Envolver funciones en promesas para usar async/await en server.js
function saveSubmission(data) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO submissions (
        type, nombre, area, email,
        iniciativa_nombre, iniciativa_estado, iniciativa_impacto, iniciativa_destinatario,
        iniciativa_tipo_tech, iniciativa_problema, iniciativa_solucion, iniciativa_beneficio,
        iniciativa_ahorro_segundos, iniciativa_usuarios_estimados, iniciativa_componentes, iniciativa_fuentes,
        tarea_tipo, tarea_frecuencia, tarea_duracion, tarea_unidad,
        tarea_tiene_idea, tarea_idea_nombre, tarea_idea_descripcion, tarea_idea_estado,
        tarea_idea_herramienta, tarea_participacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      data.type,
      data.nombre,
      data.area,
      data.email || null,
      
      // Iniciativa
      data.iniciativa_nombre || null,
      data.iniciativa_estado || null,
      data.iniciativa_impacto || null,
      data.iniciativa_destinatario || null,
      data.iniciativa_tipo_tech || null,
      data.iniciativa_problema || null,
      data.iniciativa_solucion || null,
      data.iniciativa_beneficio || null,
      data.iniciativa_ahorro_segundos !== undefined ? parseInt(data.iniciativa_ahorro_segundos) : null,
      data.iniciativa_usuarios_estimados !== undefined ? parseInt(data.iniciativa_usuarios_estimados) : null,
      data.iniciativa_componentes ? JSON.stringify(data.iniciativa_componentes) : null,
      data.iniciativa_fuentes ? JSON.stringify(data.iniciativa_fuentes) : null,
      
      // Tarea
      data.tarea_tipo || null,
      data.tarea_frecuencia || null,
      data.tarea_duracion || null,
      data.tarea_unidad || null,
      data.tarea_tiene_idea || null,
      data.tarea_idea_nombre || null,
      data.tarea_idea_descripcion || null,
      data.tarea_idea_estado || null,
      data.tarea_idea_herramienta || null,
      data.tarea_participacion || null
    ];

    db.run(query, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, ...data });
      }
    });
  });
}

function getAllSubmissions() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM submissions ORDER BY created_at DESC', [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        // Parsear los JSON de componentes y fuentes para facilitar su consumo
        const formatted = rows.map(row => {
          const newRow = { ...row };
          if (row.iniciativa_componentes) {
            try {
              newRow.iniciativa_componentes = JSON.parse(row.iniciativa_componentes);
            } catch (e) {
              // Dejar como está si no es JSON válido
            }
          }
          if (row.iniciativa_fuentes) {
            try {
              newRow.iniciativa_fuentes = JSON.parse(row.iniciativa_fuentes);
            } catch (e) {
              // Dejar como está
            }
          }
          return newRow;
        });
        resolve(formatted);
      }
    });
  });
}

module.exports = {
  db,
  saveSubmission,
  getAllSubmissions
};
