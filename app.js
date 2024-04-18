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


/**
 * socket.send(ln)
 * .on("receiveloginname", (qq) => {
 * })
 * 
 * 
 in idk.js
in a for loop:
function loadScript(src) {
return new Promise(function(resolve, reject) {
let script = document.createElement('script');//for image
script.src = src; // let src be image src (array val)
script.onload = () => resolve(script); // resolve(image element)
script.onerror = () => reject(new Error(`Script load
error for ${src}`));

want img to align w value in directions (null for 0?)

Promise.all([
new Promise(resolve => setTimeout(() => resolve(1), 3000)),
// 1
new Promise(resolve => setTimeout(() => resolve(2), 2000)),
// 2
new Promise(resolve => setTimeout(() => resolve(3), 1000))
// 3
]).then(pass function (namely array of image function (funct that copies images)));
// 1,2,3 when promises are ready: each promise contributes
an array member

document.head.append(script);

});
}
 */