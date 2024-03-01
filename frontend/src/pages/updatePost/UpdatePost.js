import React from "react";
import { getPostById, updatePost } from "../../api/internal";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./UpdatePost.module.css";
import { useSelector } from "react-redux";
import { isURL } from "validator";

const UpdatePost = () => {
  const author = useSelector((state) => state.user._id);
  const navigate = useNavigate();
  const params = useParams();
  const postId = params.id;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [photopath, setPhotoPath] = useState("");

  useEffect(() => {
    (async function getPost() {
      try {
        const response = await getPostById(postId);
        if (response.status === 200) {
          setTitle(response.data.post.title);
          setContent(response.data.post.content);
          setPhotoPath(response.data.post.photopath);
        }
      } catch (error) {}
    })();
  }, []);

  const getPhoto = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPhotoPath(reader.result);
    };
  };
  const handleUpatePost = async () => {
    let data;
    if (isURL(photopath)) {
      data = {
        content,
        title,
        postId,
        author,
      };
    } else {
      data = {
        content,
        title,
        photopath,
        postId,
        author,
      };
    }
    try {
      const response = await updatePost(data);
      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      return error;
    }
  };
  return (
    <div>
      <div className={styles.update}>
        <input
          type="text"
          name="title"
          placeholder={title}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          name="title"
          placeholder={content}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="file"
          name="image"
          placeholder={photopath}
          accept="image/jpg,image/png,image/jpeg"
          onChange={getPhoto}
        />
        <img src={photopath} alt="postImage" />
      </div>
      <button onClick={handleUpatePost}>update</button>
    </div>
  );
};

export default UpdatePost;
