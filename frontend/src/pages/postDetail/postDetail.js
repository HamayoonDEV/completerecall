import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UpdatePost from "../updatePost/UpdatePost";
import {
  getPostById,
  getComments,
  createComment,
  deletePost,
} from "../../api/internal";
import { useSelector } from "react-redux";

import styles from "./postDetail.module.css";

const PostDetail = () => {
  const navigate = useNavigate();
  const params = useParams();
  const author = useSelector((state) => state.user._id);
  const postId = params.id;
  const [post, setPost] = useState([]);
  const [comments, setComments] = useState([]);
  const [postComment, setPostComment] = useState("");
  const [reload, setReload] = useState(true);
  console.log(post);
  useEffect(() => {
    (async function getPost() {
      const response = await getPostById(postId);
      if (response.status === 200) {
        setPost(response.data.post);
      }
      const getCommentsBypostId = await getComments(postId);
      if (getCommentsBypostId.status === 200) {
        setComments(getCommentsBypostId.data.comments);
      }
    })();
  }, [reload]);
  const handlePostComment = async () => {
    const data = {
      author,
      postId,
      content: postComment,
    };
    try {
      const response = await createComment(data);
      if (response.status === 201) {
        setReload(!reload);
        setPostComment("");
      }
    } catch (error) {
      return error;
    }
  };
  const handleDelete = async () => {
    try {
      const response = await deletePost(postId);
      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      return error;
    }
  };
  return (
    <div>
      <div className={styles.postCard}>
        <h1>{post.title}</h1>
        <h3>{post?.author?.username}</h3>
        <p>{post.content}</p>
        <img src={post.photopath} />
        <span>{post.updatedAt}</span>
        <div className={styles.commentSection}>
          {comments.map((comment) => (
            <div>
              <h2>{comment?.author?.username}</h2>
              <p>{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <input
          type="text"
          name="comment"
          placeholder="post Comment"
          value={postComment}
          onChange={(e) => setPostComment(e.target.value)}
        />
        <button onClick={handlePostComment}>Post</button>
      </div>
      {author === post?.author?._id ? (
        <div>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={() => navigate(`/post/update/${postId}`)}>
            update
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default PostDetail;
