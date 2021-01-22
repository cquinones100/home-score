import dbConnection from "../dbConnection";
import scrapeImageUrls from "../scrapeImageUrls";

const scrapeImages = async () => {
  const homes = await dbConnection('homes');

  await Promise.all(homes.map(async home => {
    const urls = await scrapeImageUrls(home.url, home.address)

    await dbConnection('homes')
      .where({ home_id: home.home_id })
      .update({ image_urls: urls.join(',') });
  }));

  process.exit();
};

scrapeImages();