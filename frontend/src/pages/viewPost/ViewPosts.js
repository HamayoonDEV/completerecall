import React from "react";
import { getPosts } from "../../api/internal";
import { useEffect, useState } from "react";
import styles from "./ViewPosts.module.css";
import { useNavigate } from "react-router-dom";

const ViewPosts = () => {
  const navigate = useNavigate();
  const [posts, setPost] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    (async function getAllpost() {
      try {
        const response = await getPosts();
        if (response.status === 200) {
          setPost(response.data.posts);
        } else if (response.code === " ERR_BAD_REQUEST") {
          setError(response.response.data.message);
        }
      } catch (error) {
        return error;
      }
    })();
  }, []);

  return (
    <div className={styles.posts}>
      <h1>Posts</h1>
      <div className={styles.post}>
        {posts.map((post) => (
          <div onClick={() => navigate(`/post/${post._id}`)}>
            <h2>{post.title}</h2>
            <h5>{post.author.username}</h5>
            <img src={post.photopath} />
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewPosts;
