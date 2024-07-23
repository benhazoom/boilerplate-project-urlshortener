require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const asyncHandler = require ('express-async-handler');
var bodyParser = require('body-parser')
const dns = require('dns');
const mongoose = require('mongoose')
console.log(process.env.dbURI);
const Url = require('./models/url');
let index = 1;


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

//, { useNewUrlParser: true, useUnifiedTopology: true }
//MongoDB
const client = mongoose.connect(process.env.dbURI)
.then(result => app.listen(3000))
.catch(err => console.log(err));

//middleweres from bodyParser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  console.log(req.body);
  const newUrl = Url ({url:req.body.url,short_url:index});
  newUrl.save()
  .then((result)=>{
    index++;
    res.json({original_url:newUrl.url,url:newUrl.short_url});
  })
  .catch((err)=>{
  console.log(err);
  });
});

app.get('/api/shorturl/:id', asyncHandler(async (req, res) => {
  //
  console.log("hey")
  const url = await Url.findOne({short_url:req.params.id});
  const originalUrl = url.url;
  res.redirect(originalUrl) ;
}));
  

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});