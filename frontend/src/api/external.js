import axios from "axios";

const NEWS_API = process.env.REACT_APP_API_KEY;
const TESLA_API_STRING = `
https://newsapi.org/v2/everything?q=tesla&from=2024-02-01&sortBy=publishedAt&apiKey=${NEWS_API}`;

export const fetchTesla = async () => {
  let response;
  try {
    response = await axios.get(TESLA_API_STRING);

    return response.data.articles.slice(0, 15);
  } catch (error) {
    return error;
  }
};
