const { Sequelize } = require('sequelize');

// Configuración de conexión
const sequelize = new Sequelize('sbv360', 'sbv360_user', 'password123', { // Cambia estos valores si configuraste otros
    host: 'localhost',
    dialect: 'mysql', // Cambia a 'postgres' si usas PostgreSQL
    logging: false, // Desactiva el logging para evitar demasiada salida en la consola
});

// Verificar conexión
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
})();

module.exports = sequelize;
