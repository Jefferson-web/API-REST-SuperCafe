const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const { extname } = require('path');
const User = require('../model/User');
const Product = require('../model/Product');

var allowedTypes = ['image/jpeg', 'image/png'];
var allowrdDocuments = ['users', 'products']

function uploadImg(req, res) {

    const document = req.params["document"];
    const id = req.params["id"];

    var form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {

        if (err) throw err;

        const type = files.img.type;

        const extension = extname(files.img.name);

        const file_name = `${id}-${new Date().getMilliseconds()}${extension}`;

        if (!allowedTypes.includes(type)) {
            return res.status(400).json({
                "title": "Bad Request",
                "status": 400,
                "detail": "Solo se aceptan imagenes de extensión JPG y PNG",
                "timestamp": Date.now()
            });
        }

        if (!allowrdDocuments.includes(document)) {
            return res.status(400).json({
                "title": "Bad Request",
                "status": 400,
                "detail": "Los documentos permitidos son " + allowrdDocuments.join(', '),
                "timestamp": Date.now()
            });
        }

        let oldPath = files.img.path;
        let newPath = path.join(process.cwd(), `uploads/${document}/${file_name}`);
        let rawData = fs.readFileSync(oldPath);

        fs.writeFile(newPath, rawData, (err) => {

            if (err) throw err;

            switch (document) {
                case 'users':
                    imageUser(id, res, file_name);
                    break;
                case 'products':
                    imageProducts(id, res, file_name);
                    break;
                default:
                    break;
            }

        });

    });
}

function imageUser(id, res, file_name) {

    User.findById(id, (err, user) => {

        if (err) throw err;

        if (!user) {

            return res.status(404).json({
                "title": "Resource not found",
                "status": 404,
                "detail": `User with id ${id} not found`,
                "timestamp": Date.now()
            });

        }

        deleteFile(user.img, 'users');

        if (err) throw err;

        user.img = file_name;

        user.save((err, updatedUser) => {

            if (err) throw err;

            return res.status(200).json({
                status: "ok",
                message: "Image uploaded correctly",
                user: updatedUser
            });

        });

    });

}

function imageProducts(id, res, file_name) {

    Product.findById(id, (err, product) => {

        if (err) throw err;

        if (!product) {

            return res.status(404).json({
                "title": "Resource not found",
                "status": 404,
                "detail": `Product with id ${id} not found`,
                "timestamp": Date.now()
            });

        }

        deleteFile(product.img, 'products');

        if (err) throw err;

        product.img = file_name;

        product.save((err, updatedProduct) => {

            if (err) throw err;

            return res.status(200).json({
                status: "ok",
                message: "Image uploaded correctly",
                user: updatedProduct
            });

        });

    });

}

function deleteFile(file_name, document) {
    const oldPath = path.join(process.cwd(), `uploads/${document}/${file_name}`);
    if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
    }
}

module.exports = {
    uploadImg
}