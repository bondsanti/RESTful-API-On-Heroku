const fs = require('fs'); //file system node js
const path = require('path');
const uuidv4 = require('uuid'); //node uuidv  npm install uuid
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);
const config = require('../config/index');

// const { Storage } = require('@google-cloud/storage'); npm install @google-cloud/storage
// const stream = require('stream');

const Shop = require('../models/shop');
const Menu = require('../models/menu');

//get shop
exports.index = async(req, res, next) => {
    const shop = await Shop.find().select('name photo location').sort({ _id: -1 }); //ASC 1 DESC -1
    const urlWithphoto = await shop.map((shopRow, index) => {
        return {
            id: shopRow._id,
            name: shopRow.name,
            photo: config.DOMAIN + '/images/' + shopRow.photo,
            location: shopRow.location
        }
    })
    res.status(200).json({
        data: urlWithphoto
    });
}

//get menu
exports.menu = async(req, res, next) => {
    // const menu = await Menu.find().select('+name -img')
    // const menu = await Menu.find().where('price').gte(100);
    // const menu = await Menu.find().where('price').gte(100);
    // const menu = await Menu.find();
    const menu = await Menu.find().populate('shop', 'name location photo -_id').sort({ _id: -1 });

    res.status(200).json({
        data: menu
    });
}

//get shop by id wiht menu
exports.getShopWithmenu = async(req, res, next) => {
    const { id } = req.params;
    const shopWithMenu = await Shop.findById(id).populate('menus');
    res.status(200).json({
        data: shopWithMenu
    });
}



//insert
exports.insert = async(req, res, next) => {
    const { name, photo, location } = req.body;

    let shop = new Shop({
        name: name,
        photo: await saveImageToDisk(photo),
        location: location
    });
    await shop.save();

    res.status(201).json({
        message: 'เพิ่มข้อมูลสำเร็จ'
    });
}

//-- อัพโหลด รูปภาพ -- //

async function saveImageToDisk(baseImage) {
    //หา path จริงของโปรเจค
    const projectPath = path.resolve('./');
    //โฟลเดอร์และ path ของการอัปโหลด
    const uploadPath = `${projectPath}/public/images/`;

    //หานามสกุลไฟล์
    const ext = baseImage.substring(baseImage.indexOf("/") + 1, baseImage.indexOf(";base64"));

    //สุ่มชื่อไฟล์ใหม่ พร้อมนามสกุล
    let filename = '';
    if (ext === 'svg+xml') {
        filename = `${uuidv4.v4()}.svg`;
    } else {
        filename = `${uuidv4.v4()}.${ext}`;
    }

    //Extract base64 data ออกมา
    let image = decodeBase64Image(baseImage);

    //เขียนไฟล์ไปไว้ที่ path
    await writeFileAsync(uploadPath + filename, image.data, 'base64');
    //return ชื่อไฟล์ใหม่ออกไป
    return filename;
}

function decodeBase64Image(base64Str) {
    var matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var image = {};
    if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 string');
    }

    image.type = matches[1];
    image.data = matches[2];

    return image;
}