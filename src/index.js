const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const request = require('request');
const {screenshot} = require('./config/default');
const saveImage = require('./helper/saveImage');



(async () => {
  const browser = await puppeteer.launch({executablePath:path.resolve(__dirname,'./../../Chromium.app/Contents/MacOS/Chromium'),headless:false});
  const page = await browser.newPage();
  await page.goto('https://images.baidu.com/');
  console.log('go tohttps://images.baidu.com/');
  await page.setViewport({
    width:1280,
    height:720
  });
  console.log('setViewport done');

  await page.focus('#kw');
  // await page.keyboard.type('Hello');
  await page.keyboard.sendCharacter('猫');
  await page.waitFor(1000);
  await page.click('.s_search',2000);
  console.log('go to search');

    page.on('load',async function(){
      console.log('page is loaded');
      const srcs = await page.evaluate(function(){
        const images = document.querySelectorAll('img.main_img');
        return Array.prototype.map.call(images,(img)=>img.src);

      });
      console.log(`一共有多少图片${srcs.length}`);
      srcs.forEach(async (src)=>{
        await saveImage(src,screenshot);
      });
    });
  
    // 保存图片
    // await request(imgUrl).pipe(fs.createWriteStream(`./images/${Date.now()}.png`));


  console.log('this will close the page');
  // await browser.close();
})();