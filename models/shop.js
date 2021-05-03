const mongoose = require('mongoose');
//const { Schema } = mongoose;

const shopSchema = new mongoose.Schema({
    name: { type: String, require: true, trim: true },
    photo: { type: String, default: 'nopic.png'},
    location: { 
        lat: {type : String},
        lgn: {type : String}
     },
    //  createdAt: { type: Date, default: Date.now },
    //  updatedAt: { type: Date, default: Date.now }
}, {
    toJSON:{virtuals:true},
    timestamps: true,
    collection: 'shops' //ชื่อ Document
});

shopSchema.virtual('menus',{
    ref:'Menu',//ลิงค์ไปที่ Model
    localField:'_id',// id ฟิลด์ของโมเดลออก shop
    foreignField: 'shop' // shop ฟิลดฺของโมเดล Menu Fk
});

const shop = mongoose.model('Shop', shopSchema);
module.exports = shop