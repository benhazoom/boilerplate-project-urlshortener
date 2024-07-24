require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const asyncHandler = require("express-async-handler");
var bodyParser = require("body-parser");
const dns = require("dns");
const mongoose = require("mongoose");
const Url = require("./models/url");
let index = 0;

// Basic Configuration
const port = process.env.PORT || 3000;
const client = mongoose
  .connect(process.env.dbURI)
  .then((result) => app.listen(8080))
  .catch((err) => console.log(err));

//middleweres from bodyParser
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(`${process.cwd()}/public`));

//home page render
app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

//post url
app.post("/api/shorturl", async (req, res) => {
  let urlObject = null;

  if (
    req.body.url.startsWith("http://") ||
    req.body.url.startsWith("https://")
  ) {
    try {
      urlObject = await Url.findOne({ original_url: req.body.url });
      console.log(urlObject);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
    if (urlObject === null) {
      console.log("inserting to db");
      const newUrl = Url({ original_url: req.body.url, short_url: index });
      newUrl
        .save()
        .then((result) => {
          index++;
          res.json({
            original_url: newUrl.original_url,
            short_url: newUrl.short_url,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    //url exists in the db return its properties
    else
      res.json({
        original_url: urlObject.original_url,
        short_url: urlObject.short_url,
      });
  } else res.json({ error: "invalid url" });
});


//Asking the api to redirect to the original url by givving the shorturl
app.get("/api/shorturl/:id", async (req, res) => {
  try {
    console.log("Route parameter is-" + req.params.id);
    const urlObject = await Url.findOne({ short_url: req.params.id });
    // Log the result of the query
    console.log(`URL entry found: ${JSON.stringify(urlObject)}`);

    if (urlObject) {
      const originalUrl = urlObject.original_url;
      console.log(originalUrl);
      if (originalUrl) {
        console.log("Redirecting");
        res.redirect(originalUrl);
      } else {
        res.status(404).send("URL not found");
      }
    } else {
      res.status(404).send("URL not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

// //dns lookup - verifing url to be added on another day :)
// console.log("verifing - " + req.body.url);
// dns.lookup(req.body.url, (err, address, family) => {
//   console.log('address: %j family: IPv%s', address, family);
//   //checking if the url is in the db already
