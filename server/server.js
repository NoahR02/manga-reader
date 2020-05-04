require("dotenv").config({});
const express = require("express");
const app = express();
const fetch = require("node-fetch");
const mongo = require("mongodb");
const cron = require("./cron");
const bodyParser = require("body-parser");

app.set("json spaces", 2);
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
cron.start();

app.post("/manga/query/:query", async (req, res) => {
  const {query} = req.params;
  const conn = await mongo.connect(process.env.mongoURI, { useUnifiedTopology: true }); 
  const mangas = await conn.db("manga-reader-DB").collection("manga").find(
  {title: { $regex: ".*"+query+".*", $options: "i" }  })
  .limit(30).sort({"views": -1})
  .toArray();
  return res.json(mangas);
});

app.post("/manga/:mangaID", async (req, res) => {
  const {mangaID} = req.params;
  const mangaInfo = await fetch(`https://www.mangaeden.com/api/manga/${mangaID}`);
  const {chapters, title, released, status, hits:views,chapters_len: chapterLength, categories:genres } = await mangaInfo.json();
  return res.json({
    chapters, title, released, status, views, chapterLength, genres
  });
});

app.listen(
  process.env.PORT || 5000, 
  () => console.log(`Listening on port ${process.env.PORT || 5000}`)
);
