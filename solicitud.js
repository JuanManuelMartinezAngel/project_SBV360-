const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Usuario = require('./User');
const Subvencion = require('./Subvencion');

const Solicitud = sequelize.define('Solicitud', {
    id_solicitud: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    estado: {
        type: DataTypes.STRING,
        defaultValue: 'pendiente', // Estados posibles: pendiente, aprobado, rechazado
    },
    fecha_solicitud: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Fecha de creación de la solicitud
    },
});

// Relación entre Usuario y Solicitud
Usuario.hasMany(Solicitud, { foreignKey: 'id_usuario' });
Solicitud.belongsTo(Usuario, { foreignKey: 'id_usuario' });

// Relación entre Subvencion y Solicitud
Subvencion.hasMany(Solicitud, { foreignKey: 'id_subvencion' });
Solicitud.belongsTo(Subvencion, { foreignKey: 'id_subvencion' });

module.exports = Solicitud;
