const fs = require('fs').promises;
const path = require('path');

const components = path.join(__dirname, 'components');
const stylesDirecction = path.join(__dirname, 'styles');
const assetsDirection = path.join(__dirname, 'assets');
const temp = path.join(__dirname, 'template.html');
const dist = path.join(__dirname, 'project-dist');
const indexFile = path.join(dist, 'index.html');
const distStyle = path.join(dist, 'style.css');

const copyRecursiveSync = async (src, dest) => {
  const exists = await fs.stat(src);
  if (exists.isDirectory()) {
    await fs.mkdir(dest, { recursive: true });
    const childItems = await fs.readdir(src);
    for (let i = 0; i < childItems.length; i++) {
      const childItemName = childItems[i];
      await copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    }
  } else {
    await fs.copyFile(src, dest);
  }
};

const main = async () => {
  try {
    if (!await fs.stat(dist).catch(() => false)) {
      await fs.mkdir(dist);
    }

    let template = await fs.readFile(temp, 'utf-8');

    const componentFiles = await fs.readdir(components);
    for (let i = 0; i < componentFiles.length; i++) {
      const componentFile = componentFiles[i];
      const componentFilePath = path.join(components, componentFile);
      const componentName = path.basename(componentFile, path.extname(componentFile));
      const componentTag = `{{${componentName}}}`;
      if (template.includes(componentTag)) {
        const componentContent = await fs.readFile(componentFilePath, 'utf-8');
        template = template.replace(new RegExp(componentTag, 'g'), componentContent);
      }
    }

    await fs.writeFile(indexFile, template);

    const styleFiles = await fs.readdir(stylesDirecction);
    let styleContent = '';
    for (let i = 0; i < styleFiles.length; i++) {
      const styleFile = styleFiles[i];
      const styleFilePath = path.join(stylesDirecction, styleFile);
      if (path.extname(styleFilePath) === '.css') {
        const styleFileContent = await fs.readFile(styleFilePath, 'utf-8');
        styleContent += styleFileContent;
      }
    }

    await fs.writeFile(distStyle, styleContent);

    const assetsSrcPath = path.resolve(assetsDirection);
    const assetsDestPath = path.resolve(dist, 'assets');
    await copyRecursiveSync(assetsSrcPath, assetsDestPath);
  } catch (err) {
    console.error(err);
  }
};

main();
