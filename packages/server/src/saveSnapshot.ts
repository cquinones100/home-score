import { Page } from 'puppeteer';
import fs from 'fs';

const saveSnapshot = async (page: Page, url: string, address: string) => {
  console.log(`Preparing to save snapshot for ${url}`);

  // try {
  //   await page.$eval('div.sectionBottomLink', (link) => {
  //     (link as HTMLLinkElement).click();
  //   });
  // } catch (e) {
  //   console.log('failed to open up summary');
  // }

  const dir = process.cwd() + `/snapshots/${address}`; 

  fs.mkdir(dir, (err) => { });

  await page.screenshot({
    fullPage: true,
    path:`${dir}/screenshot1.png`
  });

  // try {
  //   await page.$eval('img.landscape', (link) => {
  //     (link as HTMLLinkElement).click();
  //   })
  // } catch(e) {
  //   console.log('failed to open up images')
  // }

  // await page.screenshot({
  //   fullPage: true,
  //   path:`${dir}/screenshot2.png`
  // });
};

export default saveSnapshot;
