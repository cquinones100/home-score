import { Page } from 'puppeteer';

const saveSnapshot = async (page: Page, url: string, address: string) => {
  await page.$eval('div.sectionBottomLink', (link) => {
    (link as HTMLLinkElement).click();
  });

  await page.screenshot({
    fullPage: true,
    path:`snapshots/${address}.png`
  });
};

export default saveSnapshot;
