const mongo = require("mongodb");
const ObjectId = mongo.ObjectId;
const CronJob = require("cron").CronJob;
const fetch = require("node-fetch");

const task = new CronJob("0 * * * *", () => {
 
  (async () => {
    const res = await fetch(process.env.mangaEden+"/list/0");
    const {manga} = await res.json();
    
    const mangaArray = manga.filter( (manga) => manga.ld === undefined ? false : manga).map( (manga) => {
      const {t, im, s, ld, h, c, a, i} = manga;
      return {
        title : t,
        coverImage: im,
        status: s,
        lastUpdated: ld,
        views: h,
        _id: new ObjectId(i),
        genres: c,
        alias: a      
      }
    } );
    
    const conn = await mongo.connect(process.env.mongoURI, { useUnifiedTopology: true }); 
    
    let bulkUpdateOps = [];
    for(let i = 0; i < mangaArray.length; ++i) {
      bulkUpdateOps.push({
        updateOne: {
          filter: { _id: ObjectId(mangaArray[i]._id), lastUpdated: {$ne:mangaArray[i].lastUpdated}  },
          update: { $set: { "lastUpdated": mangaArray[i].lastUpdated} }
        }
      });
    }
    await conn.db("manga-reader-DB").collection("manga").bulkWrite(bulkUpdateOps);
    bulkUpdateOps = [];
   
    for(let i = 0; i < mangaArray.length; ++i) {
        if(await conn.db("manga-reader-DB").collection("manga").find({ title: mangaArray[i].title }).count() === 0 ) {
          conn.db("manga-reader-DB").collection("manga").insertOne(mangaArray[i]);
        }
    }
  
  
  }
  )();
}, null, true);


module.exports = task;

