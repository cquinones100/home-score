import scrapeImageUrls from "./scrapeImageUrls";
import Home from '../../../src/types/Home';
import HomeWithImageUrls from "../../../src/types/HomeWithImageUrls";
import dbConnection from "./dbConnection";
import insertHomeImageUrls from "./insertHomeImageUrls";

const homeWithImageUrls =
  async (home: Home): Promise<HomeWithImageUrls> => {
    let image_urls;

    const image_url_records = await dbConnection('home_image_urls')
      .where({ home_id: home.home_id })

    if (image_url_records.length = 0) {
      const urls = await scrapeImageUrls(home.url, home.address);

      image_urls = await insertHomeImageUrls(home, urls);
    } else {
      image_urls = image_url_records.map(({ url }) => url);
    }

    return {
      ...home,
      image_urls
    }
  };

export default homeWithImageUrls;
