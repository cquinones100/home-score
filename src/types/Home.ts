import Category from "./Category";

type Home = {
  home_id: number;
  url: string;
  address: string;
  categories?: Category[];
  image_urls: string;
  scores: {
    score: number,
    user_name: string
  }
  score: number;
}

export default Home;
