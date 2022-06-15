import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./profile.css";
import { GrUserAdd } from "react-icons/gr";
import { getChats, newChat } from "../redux/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { AiFillFileAdd } from "react-icons/ai";
import { addNewPost, getPosts } from "../redux/postSlice";
const Profile = ({ socket }) => {
  // socketSetup();
  const dispatch = useDispatch();
  const [name, setName] = useState({});
  const [postInfo, setPostInfo] = useState({});
  const [file, setFile] = useState({});

  useEffect(() => {
    dispatch(getChats());
    dispatch(getPosts());
  }, [dispatch]);

  const chat = useSelector((state) => state.chat);
  const post = useSelector((state) => state.post);

  //**********************************************/
  const handleChange = (e) => {
    setPostInfo({ ...postInfo, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addNewPost({ postInfo, file }));
  };
  return (
    <div>
      <h2>Profile</h2>

      <Link to={`/chat`}> Chatroom </Link>
      <br />
      <br />
      <input
        id="pass-2"
        type="text"
        className="input"
        name="name"
        onChange={(e) => setName(e.target.value)}
      />
      <GrUserAdd
        style={{ fontSize: "26px", cursor: "pointer" }}
        onClick={() =>
          dispatch(
            newChat({
              name,
            })
          )
        }
      />
      <div
        className="list-wrapper"
        ng-app="app"
        ng-controller="MainCtrl as ctrl"
      >
        <ul className="list">
          {chat.chats &&
            chat.chats.map((chat) => {
              return (
                <li className="list-item" key={chat._id}>
                  <div>
                    <img
                      src="https://image.flaticon.com/icons/png/512/69/69589.png"
                      className="list-item-image"
                      alt=""
                    />
                  </div>
                  <div className="list-item-content">
                    <Link to={`/Chat/${chat._id}`}>{chat.name}</Link>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>

      <h5>Groups</h5>

      <div
        className="list-wrapper"
        ng-app="app"
        ng-controller="MainCtrl as ctrl"
      >
        <ul className="list">
          <li className="list-item">
            <div>
              <img
                src="https://image.flaticon.com/icons/png/512/69/69589.png"
                className="list-item-image"
                alt=""
              />
            </div>
            <div className="list-item-content">
              <h4>Hitesh Kumar</h4>
            </div>
          </li>
        </ul>
      </div>
      <h2>Add post</h2>
      <form>
        <input
          type="text"
          name="title"
          onChange={handleChange}
          placeholder="title"
        />
        <input
          type="text"
          name="description"
          onChange={handleChange}
          placeholder="description"
        />
        <input
          type="file"
          name="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit" onClick={handleSubmit}>
          add post
        </button>
      </form>
      <br />
      <br />
      <br />
      <br />
      <br />
      <AiFillFileAdd style={{ fontSize: "26px" }} />
      {post.posts &&
        post.posts.map((post) => {
          return (
            <div key={post._id}>
              <Link to={`/post/${post._id}`}>{post.title}</Link>
              <br></br>
              <p>{post.decription}</p>
            </div>
          );
        })}
    </div>
  );
};

export default Profile;
