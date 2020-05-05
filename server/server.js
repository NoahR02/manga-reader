require("dotenv").config({});
const express = require("express");
const app = express();
const fetch = require("node-fetch");
const mongo = require("mongodb");
const cron = require("./cron");
const bodyParser = require("body-parser");
const redis = require("redis");
const REDISPORT = process.env.REDISPORT || 6379;
const client = redis.createClient(REDISPORT);

app.set("json spaces", 2);
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
cron.start();


const cacheQuery = (req, res, next) => {
  const {query} = req.params;
  client.get(query, (err, data) => {
    if(err) throw err;
    if(data !== null) {
      return res.json(JSON.parse(data));
    } else {
      return next();
    }
  });
}

const cacheManga = (req, res, next) => {
  const {mangaID} = req.params;
  client.get(mangaID, (err, data) => {
    if(err) throw err;
    if(data !== null) {
      return res.json(JSON.parse(data));
    } else {
      return next();
    }
  });
}

const cacheChapter = (req, res, next) => {
  const {chapterID} = req.params;
  client.get(chapterID, (err, data) => {
    if(err) throw err;
    if(data !== null) {
      return res.json(JSON.parse(data));
    } else {
      return next();
    }
  });
}

app.post("/manga/query/:query", cacheQuery, async (req, res) => {
  const {query} = req.params;
  const conn = await mongo.connect(process.env.mongoURI, { useUnifiedTopology: true }); 
  const mangas = await conn.db("manga-reader-DB").collection("manga").find(
  {title: { $regex: ".*"+query+".*", $options: "i" }  })
  .limit(30).sort({"views": -1})
  .toArray();
  client.setex(query, 3600, JSON.stringify(mangas));
  return res.json(mangas);
});

app.post("/manga/:mangaID", cacheManga, async (req, res) => {
  const {mangaID} = req.params;
  const mangaInfo = await fetch(`https://www.mangaeden.com/api/manga/${mangaID}`);
  const {chapters, title, image: imageURL, description, released, status, hits:views,chapters_len: chapterLength, categories:genres } = await mangaInfo.json();
  const manga = {chapters, title, released, status, views, chapterLength, genres, imageURL, description} ;
  client.setex(mangaID, 3600, JSON.stringify(manga));
  return res.json(manga);
});

app.post("/manga/:mangaID/chapter/:chapterID", cacheChapter, async (req, res) => {
  const {chapterID} = req.params;
  const mangaInfo = await fetch(`https://www.mangaeden.com/api/chapter/${chapterID}`);
  const {images} = await mangaInfo.json();
  client.setex(chapterID, 3600, JSON.stringify(images));
  return res.json(images);
});

app.listen(
  process.env.PORT || 5000, 
  () => console.log(`Listening on port ${process.env.PORT || 5000}`)
);
