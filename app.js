const express = require('express');
const sequelize = require('./db');

// Importar los modelos (ya los tienes configurados)
const Usuario = require('./models/User');
const Subvencion = require('./models/Subvencion');
const Solicitud = require('./models/solicitud');

const app = express();

// Middleware para JSON
app.use(express.json());

// Sincronizar la base de datos
(async () => {
    try {
        await sequelize.sync({ force: false }); // Cambiar a true si quieres reiniciar las tablas
        console.log('Base de datos sincronizada correctamente.');
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);
    }
})();

// Rutas de prueba
app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente.');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
