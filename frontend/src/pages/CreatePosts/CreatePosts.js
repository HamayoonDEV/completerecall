import React, { useState } from "react";
import styles from "./CreatePosts.module.css";
import { createPost } from "../../api/internal";
import Input from "../../compnents/inputText/Input";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreatePosts = () => {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [photopath, setPhotoPath] = useState("");
  const author = useSelector((state) => state.user._id);

  const getPhoto = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPhotoPath(reader.result);
    };
  };
  const handlePost = async () => {
    const data = {
      content,
      title,
      photopath,
      author,
    };
    try {
      const response = await createPost(data);
      if (response.status === 201) {
        navigate("/");
      }
    } catch (error) {
      return error;
    }
  };
  return (
    <div className={styles.submit}>
      <h1>createPost</h1>
      <div className={styles.input}>
        <Input
          className={styles.title}
          type="text"
          name="title"
          placeholder="Add title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className={styles.textarea}
          type="text"
          name="content"
          placeholder="type your description here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={400}
        />
      </div>
      <div>
        <p>please choose a file</p>
        <input
          type="file"
          id="file"
          accept="image/jpg,image/jpeg,image/png"
          onChange={getPhoto}
        />
      </div>
      <button onClick={handlePost}>Post</button>
    </div>
  );
};

export default CreatePosts;
