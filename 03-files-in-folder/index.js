const fs = require('fs');
const path = require('path');

const secretFolderPath = path.join(__dirname,  'secret-folder');

fs.promises.readdir(secretFolderPath, { withFileTypes: true })
  .then(files => {
    files.forEach(async dirent => {
      if (dirent.isFile()) {
        const { name, ext } = path.parse(dirent.name);
        const filePath = path.join(secretFolderPath, dirent.name);
        const stats = await fs.promises.stat(filePath);
        const fileSizeInBytes = stats.size;
        const fileSizeInKb = fileSizeInBytes / 1024;
        console.log(`${name}${ext} - ${fileSizeInKb} kb`);
      }
    });
  })
  .catch(err => console.error(err));
