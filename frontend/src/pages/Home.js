import React from "react";
import styles from "./Home.module.css";
import { useState, useEffect } from "react";
import { fetchTesla } from "../api/external";

const Home = () => {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    (async function getArticles() {
      try {
        const response = await fetchTesla();
        setArticles(response);
      } catch (error) {
        return console.log("Articles not found!", error);
      }
    })();
  }, []);
  return (
    <div className={styles.main}>
      <h1>Articles</h1>
      <div className={styles.mainCard}>
        {articles.map((article) => (
          <div key={article.title} className={styles.card}>
            <img src={article.urlToImage} />
            <h2>{article.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
