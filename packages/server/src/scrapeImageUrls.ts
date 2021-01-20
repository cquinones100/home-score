import puppeteer from 'puppeteer';

const scrapeImageUrls = async (url: string, address: string): Promise<string[]> => {
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
  await page.goto(url);

  const srcs = await page.$$eval(`img.landscape`, images => {
    return images.map(image => image.getAttribute('src'));
  });

  await browser.close();

  return srcs as string[];
};

export default scrapeImageUrls;
