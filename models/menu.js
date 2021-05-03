const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuSchema = Schema({
    name: { type: String, require: true, trim: true },
    price: { type: Number},
    // key joint เหมื่อน sql 1:m
    shop: { type: Schema.Types.ObjectId, ref:'Shop' }
}, {
    toJSON:{virtuals:true},
    timestamps: true,
    collection: 'menus' //ชื่อ Document
});

menuSchema.virtual('price_vat').get(function (){
    return (this.price*0.07) + this.price;
})

const menu = mongoose.model('Menu', menuSchema);
module.exports = menu