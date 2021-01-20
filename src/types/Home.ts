import Category from "./Category";

type Home = {
  home_id: number;
  url: string;
  address: string;
  score: number;
  user_name: string;
  categories?: Category[];
  image_urls: string;
}

export default Home;
