const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist') {
        filelist = walkSync(filePath, filelist);
      }
    } else if (filePath.endsWith('.jsx')) {
      filelist.push(filePath);
    }
  });
  return filelist;
};

const mapNames = {
  emerald: 'pink',
  teal: 'rose'
};

const files = walkSync(path.join(__dirname, 'client', 'src'));
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    Object.keys(mapNames).forEach(key => {
        const regex = new RegExp(`\\b${key}(-[0-9]+)\\b`, 'g');
        if (regex.test(content)) {
            content = content.replace(regex, `${mapNames[key]}$1`);
            changed = true;
        }
    });

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated ' + path.basename(file));
    }
});
