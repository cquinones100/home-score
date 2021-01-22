import dbConnection from "../dbConnection";
import insertHomeImageUrls from "../insertHomeImageUrls";
import scrapeImageUrls from "../scrapeImageUrls";

const scrapeImages = async () => {
  const homes = await dbConnection('homes');

  await Promise.all(homes.map(async home => {
    const urls = await scrapeImageUrls(home.url, home.address)

    await insertHomeImageUrls(home, urls);
  }));

  process.exit();
};

scrapeImages();
