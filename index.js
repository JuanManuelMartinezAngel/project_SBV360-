const express = require('express');
const sequelize = require('./db'); // Archivo donde configuraste Sequelize

// Importar los modelos
const Usuario = require('./models/User');
const Subvencion = require('./models/Subvencion');
const Solicitud = require('./models/solicitud');

// Crear una instancia de Express
const app = express();

// Middleware para manejar JSON
app.use(express.json());

// Sincronizar la base de datos
(async () => {
    try {
        await sequelize.sync({ force: false }); // Cambia a true para reiniciar las tablas en cada inicio
        console.log('Base de datos sincronizada correctamente.');
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);
    }
})();

// Ruta base de prueba
app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente.');
});

// Configuración del puerto
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

