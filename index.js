require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const dns = require("node:dns");

// Basic Configuration
const port = process.env.PORT || 3000;

const urls = [];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", function (req, res) {
  const url = req.body.url;

  const regex = /^(ftp|http|https):\/\/[^ "]+$/;

  if (!regex.test(url)) {
    return res.json({ error: "Invalid URL" });
  }

  urls.push(url);

  res.json({
    original_url: url,
    short_url: urls.length,
  });
});

app.get("/api/shorturl/:url", function (req, res) {
  const url = Number(req.params.url);

  if (urls[url - 1]) {
    res.redirect(urls[url - 1]);
  }

  return res.json({
    error: "Invalid short url",
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
