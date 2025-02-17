const fsPromises = require("fs").promises;
const path = require("path");
require("dotenv").config();

const data = {
  comments: require("./../model/comments.json"),
  setComments: function (data) {
    this.comments = data;
  },
};

function getComments(req, res) {
  const post_id = req.params.post_id;

  const postComments = data.comments.filter(
    (comment) => comment.post_id === post_id
  );
  return res.status(200).json(postComments);
}

async function addComment(req, res) {
  const { post_id, comment_username, message } = req.body;

  const doesCommentExist = data.comments.find(
    (comment) =>
      comment.post_id === post_id &&
      comment.comment_username === comment_username &&
      comment.message == message
  );

  if (doesCommentExist)
    return res.status(200).json({ message: "Comment has already been posted" });

  const thisComment = {
    post_id: post_id,
    comment_username: comment_username,
    message: message,
    timestamp: Date.now(),
  };

  const otherComments = data.comments;

  data.setComments([...otherComments, thisComment]);

  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "comments.json"),
    JSON.stringify(data.comments)
  );

  return res.status(200).json({ message: `You have commented on this post` });
}

async function removeComment(req, res) {
  const { post_id, comment_username, message } = req.body;

  const doesCommentExist = data.comments.find(
    (comment) =>
      comment.post_id === post_id &&
      comment.comment_username === comment_username &&
      comment.message == message
  );

  if (!doesCommentExist)
    return res.status(200).json({ message: "Comment could not be found" });

  const otherComments = data.comments.filter(
    (comment) =>
      !(
        comment.post_id === post_id &&
        comment.comment_username === comment_username &&
        comment.message == message
      )
  );

  data.setComments([...otherComments]);

  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "comments.json"),
    JSON.stringify(data.comments)
  );

  return res
    .status(200)
    .json({ message: `You have removed the comment on this post` });
}

module.exports = { getComments, addComment, removeComment };
