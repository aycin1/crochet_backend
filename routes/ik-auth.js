const express = require("express");
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
  urlEndpoint: process.env.URL_ENDPOINT,
});

const router = express.Router();

function getUploadAuth(req, res) {
  const { token, expire, signature } = imagekit.getAuthenticationParameters();
  res.send({ token, expire, signature, publicKey: process.env.PUBLIC_KEY });
}

router.get("/", (req, res) => getUploadAuth(req, res));

module.exports = router;
