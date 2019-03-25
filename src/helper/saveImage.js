const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const {
    promisify
} = require('util');
const writeFile = promisify(fs.writeFile);
module.exports = async (src, dir) => {
    if (/^http/.test(src)) {
        await urlToImage(src, dir);
    } else {
        await base64ToImage(src, dir);
    }

}

//url保存image
const urlToImage = promisify(function (url, dir, callback) {
    const mod = /^https:/.test(url) ? https : http;
    const ext = path.extname(url);
    const file = path.join(dir,`${Date.now()}${ext}`);
   
    mod.get(url, (res) => {
            // console.log(res);
            res.pipe(fs.createWriteStream(file));
        })
        .on('finish', () => {
            console.log(file);
            callback();
        });
});

//base64保存image  data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA....

const base64ToImage = async function (base64, dir) {

    try {
        const result = base64.match(/^data:(.+);?base64,(.+)$/);
        const fileName = result[1].split('/')[1].replace('jpeg', 'jpg');
        await writeFile(fileName, result[2], 'base64');
        console.log(file);
    } catch (e) {
        console.log('非法的base64图片格式')
    }

}




