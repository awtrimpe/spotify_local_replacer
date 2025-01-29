const fs = require('fs');

fs.copyFile('docs/index.html', 'docs/404.html', (err) => {
  if (err) {
    console.error('index.html -> 404.html copy failed:');
    throw err;
  }
});

fs.writeFileSync('docs/.nojekyll', '');

function findFirstFileWithExtension(dirPath, extension) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    if (file.split('.')[1] && file.split('.')[1] === 'css') {
      return file;
    }
  }
}

const filePath = 'docs/' + findFirstFileWithExtension('docs', 'css');

fs.readFile(filePath, 'utf-8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  const updatedData = data.replaceAll(
    '/fonts',
    '/spotify_local_replacer/fonts',
  );

  fs.writeFile(filePath, updatedData, 'utf-8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }

    console.log('File updated successfully.');
  });
});
