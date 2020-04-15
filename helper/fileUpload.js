const fs = require('fs');
const path = require('path');


module.exports = {
  async upload(file, directoryPath) {
    try {
      let { mimetype, name } = file

      const n = mimetype.lastIndexOf('/');
      mimetype = mimetype.substring(n + 1);

      if (!fs.existsSync(directoryPath+name)) {
        directoryPath.split('/').forEach((dir, index, splits) => {
          const curParent = splits.slice(0, index).join('/');
          const dirPath = path.resolve(curParent, dir);
          if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
          }
        });
      }
      const mimeType = mimetype;
      await file.mv(`${directoryPath}.${mimetype}`);
      const filePath = `${directoryPath}.${mimetype}`;
      return { filePath, mimeType, name };
    }
    catch (e) {
      console.log(e)
      throw ('Image could not be uploded')
    }
  }
}