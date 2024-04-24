// Put your name and ID here 

const express = require("express");
const path = require("path");

// Include fs module
const fs = require('fs');
const fsPromises = require('fs').promises;

const app = express();

app.use(express.static(
  path.resolve(__dirname, "public")
));
  
app.listen(3000, () => console.log("Starting Fruit Smash"));