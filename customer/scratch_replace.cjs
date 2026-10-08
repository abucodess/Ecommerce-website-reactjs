const fs = require('fs');
const path = require('path');

const directory = 'c:/Users/abuba/Desktop/Ecommerce project/customer/src';

function replaceInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Regex to match Number(something_id_something) and replace with String(...)
  // Also matches Number(id)
  const newContent = content.replace(/Number\(([^)]*id[^)]*)\)/gi, 'String($1)');
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated:', filePath);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      replaceInFile(fullPath);
    }
  }
}

walkDir(directory);
console.log('Done');
