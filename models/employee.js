const mongoose = require('mongoose');
//const { Schema } = mongoose;

const employeeSchema = new mongoose.Schema({
    name: { type: String, require: true, trim: true },
    position: { type: String, require: true, trim: true },
    salary: { type: Number },
    created: { type: Date, default: Date.now }
}, {
    collection: 'employees' //ชื่อ Document
});

const employee = mongoose.model('Employee', employeeSchema);
module.exports = employee