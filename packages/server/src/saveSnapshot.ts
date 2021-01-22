import { Page } from 'puppeteer';
import fs from 'fs';

const saveSnapshot = async (page: Page, url: string, address: string) => {
  await page.$eval('div.sectionBottomLink', (link) => {
    (link as HTMLLinkElement).click();
  });

  const dir = process.cwd() + `/snapshots/${address}`; 

  fs.mkdir(dir, (err) => { });

  await page.screenshot({
    fullPage: true,
    path:`${dir}/screenshot1.png`
  });

  await page.$eval('img.landscape', (link) => {
    (link as HTMLLinkElement).click();
  })

  await page.screenshot({
    fullPage: true,
    path:`${dir}/screenshot2.png`
  });
};

export default saveSnapshot;
