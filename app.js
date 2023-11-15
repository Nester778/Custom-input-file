const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const mongoose = require("mongoose");
const Prod = require("./model/prodSchema");
const fs = require('fs');

mongoose.connect('mongodb://127.0.0.1:27017/upload-images')
    .then(() => {
        console.log("open");
    }).catch(err => {
        console.log("fail");
    });

const app = express();
app.set("view engine", 'ejs');
app.use(express.static(__dirname + '/views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('Index');
});

app.get('/prods', async (req, res) => {
    const prod = await Prod.find({});
    res.render('product/prods', { prod });
});

app.post('/', upload.array('images', 10), async (req, res) => {
    const files = req.files;

    const readFilePromises = files.map(file => {
        return new Promise((resolve, reject) => {
            fs.readFile(file.path, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    });

    const dataArr = await Promise.all(readFilePromises);
    const imageData = {
        data: dataArr,
    };

    const newImage = new Prod(imageData);
    await newImage.save();
    res.redirect('/prods');
});



app.listen('3030', () => {
    console.log('start');
});

