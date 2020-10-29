const Sequelize = require('sequelize');
const db = require('../config/database');

const User = db.define('users',{
    
    email:{
        type:Sequelize.STRING,
    },
    password:{
        type: Sequelize.STRING,
    },
    name:{
        type: Sequelize.STRING,
    },
   
     
}, {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
});

module.exports = User;