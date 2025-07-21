const mongoose = require('mongoose');
require('dotenv').config();
const url = process.env.MONGO_URL;

exports.dbConnection = () => {
    try {
        mongoose.connect(url)
.then(() => console.log("Database Connected"))
.catch((error) => console.log("Error In Database Connection",error))
    } catch (error) {
        process.exit(1);
    }
}