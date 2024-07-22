require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
var bodyParser = require('body-parser')

var inMemoryUrlDataBase = []; // In-memory data store for simplicity
let index = 0;
// const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
//middleweres from bodyParser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  const url = (req.body.url);
  //invalid url
  if (!url.startsWith("https://")) res.json({ error: 'invalid url' });
  //saving shortened url locally
  inMemoryUrlDataBase.push(url);
  index++;
  // let formerIndex=index-1;
  res.json({
    original_url: url, 
    short_url:index-1
  });
});

app.get('/api/shorturl/:id', function(req, res) {
  console.log(inMemoryUrlDataBase[req.params.id])
  res.redirect(inMemoryUrlDataBase[req.params.id]);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
