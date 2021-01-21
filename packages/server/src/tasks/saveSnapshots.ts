import puppeteer from 'puppeteer';
import Home from '../../../../src/types/Home';
import getHomes from '../queries/getHomes';
import saveSnapshot from '../saveSnapshot';

const saveSnapshots = async () => {
  const browser = await puppeteer.launch({
    args: [
      '--disable-setuid-sandbox',
      '--no-sandbox',
      '--no-zygote',
      '--single-process',
      'disable-gpu'
    ]
  });

  const homes = await getHomes();

  await Promise.all(
    homes.map(async (home: Home) => {
      const page = await browser.newPage();
      await page.goto(home.url);

      saveSnapshot(page, home.url, home.address);
    })
  );

  browser.close();
  console.log('Done');
};


saveSnapshots();
