const fs = require('fs');
const path = require('path');
const csv = require('csv');
const { source, destination, headers, srcFileName } = require('./config.js');

const csvAdd = function() {
  console.log('csvAdd running')
  const parseOptions = {
    columns: true
  }
  // get an array of folders from source directory
  fs.readdir(source, (err, srcFolders) => {
    if (err) {
      throw err;
    }
    // get an array of files in the destination directory
    fs.readdir(destination, (err, destFiles) => {
      if (err) {
        throw err;
      }

      srcFolders.forEach((srcFolderName, i) => {
        const srcFilePath = path.join(source, srcFolderName, srcFileName);
        const destFileName = srcFolderName + '.csv';
        const destFilePath = path.join(destination, destFileName);

        let fileExists = fs.existsSync(srcFilePath);

        if (/\.csv$/.test(srcFilePath) && fileExists) {
          fs.readFile(srcFilePath, 'utf8', (err, dataSrc) => {
            if (err) {
              throw err;
            }
            
            if (destFiles.includes(destFileName)) {

              fs.readFile(destFilePath, 'utf8', (err, dataDest) => {
                if (err) {
                  throw err;
                }

                csv.parse(dataSrc, parseOptions, (err, dataSrc) => {
                  if (err) {
                    throw err;
                  }
                
                  csv.parse(dataDest, parseOptions, (err, dataDest) => {
                    if (err) {
                      throw err;
                    }

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
                      if (err) {
                        throw err
                      }

                      let finalOutput = headers.join(',') + '\n' + output;
                      fs.writeFile(destFilePath, finalOutput, (err) => {
                        if (err) {
                          throw err
                        }

                        console.log('data added to: ', destFilePath)
                      });
                    });
                  });
                });
              });

            } else {
              fs.writeFile(destFilePath, dataSrc, (err) => {
                if (err) {
                  throw err
                }

                console.log('created and wrote to: ', destFilePath)
              });
            }
          })
        } else {
          throw new Error(`Source file located at ${srcFilePath} either does not exist or is not a csv`)
        }
      })
    })
  })
}

module.exports = {
  csvAdd
}

