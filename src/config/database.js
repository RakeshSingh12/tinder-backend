
const mongoose = require('mongoose');

const connectDB = async () => {

    await mongoose.connect('mongodb+srv://rakeshaug2022:UR62JY5pL4UXWyTM@namastenode.kcnhr.mongodb.net/');
};

module.exports = connectDB;


