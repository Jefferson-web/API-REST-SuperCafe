const path = require('path');
const fs = require('fs');

function getImage(req, res) {

    const document = req.params["document"];
    const img = req.params["img"];

    let pathImg = path.join(process.cwd(), `uploads/${document}/${img}`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        let noPathImg = path.join(process.cwd(), 'server/src/assets/no-image.png');
        res.sendFile(noPathImg);
    }

}

module.exports = {
    getImage
}