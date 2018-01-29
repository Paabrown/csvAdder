const fs = require('fs');
const path = require('path');
const csv = require('csv');
const { source, destination, headers, srcFileName } = require('./config.js');

const csvAdd = function() {
  const parseOptions = {
    columns: true
  }
  // get an array of folders from source directory
  fs.readdir(source, (err, srcFolders) => {

    // get an array of files in the destination directory
    fs.readdir(destination, (err, destFiles) => {

      srcFolders.forEach((srcFolderName, i) => {
        const srcFilePath = path.join(source, srcFolderName, srcFileName);
        const destFileName = srcFolderName + '.csv';
        const destFilePath = path.join(destination, destFileName);

        let fileExists = fs.existsSync(srcFilePath);

        if (/\.csv$/.test(srcFilePath) && fileExists) {
          fs.readFile(srcFilePath, 'utf8', (err, dataSrc) => {
            
            if (destFiles.includes(destFileName)) {

              fs.readFile(destFilePath, 'utf8', (err, dataDest) => {

                csv.parse(dataSrc, parseOptions, (err, dataSrc) => {
                
                  csv.parse(dataDest, parseOptions, (err, dataDest) => {
                    const noDups = {};
            
                    dataSrc.forEach(row => {
                      let key = row['Session ID'] + row['Transfer ID']
                      key.length ? noDups[key] = row : null;
                    });
            
                    dataDest.forEach(row => {
                      let key = row['Session ID'] + row['Transfer ID']
                      key.length ? noDups[key] = row : null;
                    });
            
                    const finalData = Object.keys(noDups).map(key => noDups[key]);
                    
                    csv.stringify(finalData, (err, output) => {
                      let finalOutput = headers.join(',') + '\n' + output;
                      fs.writeFile(destFilePath, finalOutput, (err) => console.log('err6', err)); 
                    });
                  });
                });
              });

            } else {
              fs.writeFile(destFilePath, dataSrc, (err) => console.log('err6', err));
            }
          })
        }
      })
    })
  })
}

module.exports = {
  csvAdd
}

