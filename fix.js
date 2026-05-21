const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/src="\/assets\//g, 'src="./assets/');
fs.writeFileSync('index.html', html);
console.log('Replaced successfully!');
