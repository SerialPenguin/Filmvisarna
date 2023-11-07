import {
    mkdirSync, rmSync, existsSync,
    readdirSync, statSync
  } from 'fs';
  import { dirname, join as pathJoin, basename } from 'path';
  import { fileURLToPath } from 'url';
  import sharp from 'sharp';
  
  // Settings
  const settings = {
    jpgQuality: 70,
    aspect: 16 / 9,
    widths: [250, 500, 1000, 1500, 2000]
  }
  
  // The path to the directory this script is in
  const __dirname = dirname(fileURLToPath(import.meta.url));
  
  // Paths to the source and destination folders for images
  const srcFolder = pathJoin(__dirname, '..', 'src', 'assets', 'img');
  const destFolder = pathJoin(__dirname, '..', 'src', 'assets', 'scaled');
  
  // Delete, if exists, and then (re)create the destination folder
  existsSync(destFolder) && rmSync(destFolder, { recursive: true, force: true });
  mkdirSync(destFolder);
  
  // Get the jpg files to process
  let files = readDirRecursive(srcFolder)
    .filter(x => x.slice(-4) === '.jpg');
  
  // Process files
  let metaData = {};
  for (let file of files) {
    let destPath = file.replace(srcFolder, destFolder);
    let destFolderPath = dirname(destPath);
    // create folder if not exists
    !existsSync(destFolderPath) && mkdirSync(destFolderPath);
    // scale image
    let key = file.split('/images/sources')[1];
    metaData[key] = [];
    for (let width of settings.widths) {
      console.log('Scaling ' + basename(file), 'to width', width);
      let fName = destPath.slice(0, -4) + '-' + width + 'w.jpg';
      let height = Math.round(width / settings.aspect);
      await sharp(file)
        .resize({ width, height, quality: settings.jpgQuality })
        .toFile(fName);
      metaData[key].push(fName.split('/images')[1]);
    }
  }
  // console.log(metaData);
  
  
  // read all files in a folder and its sub folders
  // (from StackOverflow)
  function readDirRecursive(dir) {
    var results = [];
    var list = readdirSync(dir);
    list.forEach(function (file) {
      file = dir + '/' + file;
      var stat = statSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(readDirRecursive(file));
      } else {
        results.push(file);
      }
    });
    return results;
  }