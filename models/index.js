const { Sequelize, DataTypes } = require('sequelize')

let db = {}
// Set up Sequelize
const env = process.env.NODE_ENV || 'development'
const config = require(`${__dirname}/../config/config.json`)[env]
const sequelize = new Sequelize(config.database, config.username, config.password, config)
db.sequelize = sequelize

// Set up models
db.Book = sequelize.define('Book', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: DataTypes.STRING,
    isbn: DataTypes.CHAR(13),
    lastPg: DataTypes.INTEGER
})
db.Notes = sequelize.define('Note', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: DataTypes.STRING,
    pg: DataTypes.STRING,
    endPg: DataTypes.STRING,
    content: DataTypes.TEXT
})
db.Book.hasMany(db.Notes, {
    foreignKey: 'BookId'
})
db.Notes.belongsTo(db.Book)

module.exports = db