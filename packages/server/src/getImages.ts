import { dbConnection } from ".";
import scrapeImageUrls from "./scrapeImageUrls";
import Home from '../../../src/types/Home';
import HomeWithImageUrls from "../../../src/types/HomeWithImageUrls";

const homeWithImageUrls =
  async (home: Home): Promise<HomeWithImageUrls> => {
    let image_urls;

    console.log(home);
    if (!home.image_urls) {
      image_urls = await scrapeImageUrls(home.url, home.address);

      await dbConnection('homes')
        .where({ home_id: home.home_id })
        .update({ image_urls: image_urls.join(',') });
    } else {
      image_urls = home.image_urls.split(',');
    }

    return {
      ...home,
      image_urls
    }
  };

export default homeWithImageUrls;
