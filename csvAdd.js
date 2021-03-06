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

      console.log('about to check all of the following:', srcFolders);

      srcFolders.forEach((srcFolderName, i) => {
        let fileStat = fs.statSync(path.join(source, srcFolderName))

        if (fileStat.isDirectory()) {
          console.log('moving onto:', srcFolderName);
          const srcFilePath = path.join(source, srcFolderName, srcFileName);
          const destFileName = srcFolderName + '.csv';
          const destFilePath = path.join(destination, destFileName);
  
          if (/\.csv$/.test(srcFilePath)) {
            fs.readFile(srcFilePath, 'utf8', (err, dataSrc) => {
              if (err) {
                console.log('skipped ', srcFilePath, 'because of err:', err)
              } else {
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
              }
              
            })
          } else {
            throw new Error('file path specified in config is not a csv:', srcFilePath)
          }
        } else {
          console.log('skipped looking in', srcFolderName, 'because it is not a directory')
        }
      })
    })
  })
}

module.exports = {
  csvAdd
}

