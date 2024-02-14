// models/user.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utils/database'); // Import konfigurasi koneksi database

const User = sequelize.define('User', {
    // Mendefinisikan kolom tabel
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Sinkronisasi model dengan database
User.sync({ force: false }).then(() => {
    console.log('Model User telah disinkronkan dengan database.');
}).catch(err => {
    console.error('Gagal menyinkronkan model User dengan database:', err);
});

module.exports = User;
