const fs = require('fs');
const path = require('path');
const glob = require('glob');

const stylesDir = path.join(__dirname+'/styles/');
const bundleFile = path.join(__dirname+'/project-dist/bundle.css');

glob(`${stylesDir}/**/*.css`, (err, files) => {
  if (err) {
    throw err;
  }

  const file = files.map((file) => {
    return new Promise((resolve, reject) => {
      fs.readFile(file, 'utf8', (err, content) => {
        if (err) {
          reject(err);
        } else {
          resolve(content);
        }
      });
    });
  });

  Promise.all(file).then((contents) => {
    const css = contents.join('\n');

    fs.writeFile(bundleFile, css, (err) => {
      if (err) {
        throw err;
      }
      console.log(`Файл ${bundleFile} успешно записан!`);
    });
  }).catch((err) => {
    throw err;
  });
});
