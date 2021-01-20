import Home from "./Home";

type HomeWithImageUrls = Omit<Home, 'image_urls'> & {
  image_urls: string[];
}

export default HomeWithImageUrls;