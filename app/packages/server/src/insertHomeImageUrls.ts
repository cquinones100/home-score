import Home from "../../../src/types/Home";
import dbConnection from "./dbConnection";

const insertHomeImageUrls = async (home: Home, urls: string[]) => {
  return await dbConnection('home_image_urls')
    .insert(
      urls.map((url: string) => {
        return {
          home_id: home.home_id,
          url
        }
      })
    )
    .returning('url');
};

export default insertHomeImageUrls;
