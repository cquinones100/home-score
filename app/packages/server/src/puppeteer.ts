import puppeteer from 'puppeteer';

(async() => {
  const browser = await puppeteer.launch({
    args: [
      '--disable-setuid-sandbox',
      '--no-sandbox',
      '--no-zygote',
      '--single-process',
      'disable-gpu'
    ]
  });

  const page = await browser.newPage();

  console.log(browser.isConnected());

  await page.goto('https://www.redfin.com/WA/Burien/14304-4th-Ave-SW-98166/home/184863');

  console.log(browser.isConnected());

  const srcs = await page.$$eval('img[alt="14304 4th Ave SW, Burien, WA 98166"]', images => {
    return images.map(image => image.getAttribute('src'));
  });

  console.log('srcs', srcs);

  await browser.close();
})();