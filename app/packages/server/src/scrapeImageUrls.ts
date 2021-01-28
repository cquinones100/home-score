import puppeteer from 'puppeteer';
import saveSnapshot from './saveSnapshot';

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

  await saveSnapshot(page, url, address);

  const srcs = await page.$$eval(`span#MBImage0`, images => {
    const bigImages = images.map((image, index) => {
      if (index === 0) {
        (image as HTMLLinkElement).click();
      }

      return image.getAttribute('src')
    });

    return bigImages;
  });

  const smallSrcs = await page.$$eval(`img[alt="image"]`, (smallImages) => {
    return smallImages.map(smallImage => {
      return smallImage.getAttribute('src') as string;
    })
  });

  await browser.close();

  return srcs.concat(smallSrcs) as string[];
};

export default scrapeImageUrls;
