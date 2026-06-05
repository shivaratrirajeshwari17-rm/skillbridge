const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/i);

if (styleMatch && styleMatch[1]) {
  fs.writeFileSync('frontend/src/index.css', styleMatch[1]);
  console.log('CSS extracted successfully');
} else {
  console.log('No style tag found');
}
