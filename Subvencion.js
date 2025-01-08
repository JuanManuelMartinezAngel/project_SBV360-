const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Subvencion = sequelize.define('Subvencion', {
    id_subvencion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'activa', // Estados posibles: activa, cerrada
    },
    fecha_limite: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    monto_maximo: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    requisitos: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
});

module.exports = Subvencion;
