const mongoose = require('mongoose');
//const { Schema } = mongoose;

const companySchema = new mongoose.Schema({
    name: String,
    address: {
        province: String,
        postcode: String
    },
}, {
    collection: 'companys' //ชื่อ Document
});

const company = mongoose.model('Company', companySchema);
module.exports = company