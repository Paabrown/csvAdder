const fs = require('fs');
const path = require('path');
const csv = require('csv');
const { source, destination, headers } = require('./config.js');

const csvAdd = function() {
  const parseOptions = {
    columns: true
  }
  // get an array of files from source directory
  fs.readdir(source, (err, srcFiles) => {

  // get an array 
    fs.readdir(destination, (err, destFiles) => {

      srcFiles.forEach((srcFileName, i) => {
        if (/\.csv$/.test(srcFileName)) {
          fs.readFile(path.join(source, srcFileName), 'utf8', (err, dataSrc) => {
            
            if (destFiles.includes(srcFileName)) {

              fs.readFile(path.join(destination, srcFileName), 'utf8', (err, dataDest) => {

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
                      fs.writeFile(path.join(destination, srcFileName), finalOutput, (err) => console.log('err6', err)); 
                    });
                  });
                });
              });

            } else {
              fs.writeFile(path.join(destination, srcFileName), dataSrc, (err) => console.log('err6', err));
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

