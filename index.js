const fs = require('fs');
const path = require('path');
const csv = require('csv');
const { source, destination, headers } = require('./config.js');

const parseOptions = {
  columns: true
}

fs.readdir(source, (err, srcFiles) => {
  console.log('err0', err);
  console.log('srcFiles', srcFiles);

  fs.readdir(destination, (err, destFiles) => {
    console.log('err1', err);
    console.log('destFiles', destFiles);

    srcFiles.forEach((srcFileName, i) => {
      if (/\.csv$/.test(srcFileName)) {
        fs.readFile(path.join(source, srcFileName), 'utf8', (err, dataSrc) => {
          console.log('err2', err);
          // console.log('dataSrc', dataSrc);
          
          if (destFiles.includes(srcFileName)) {
            console.log('it includes it once', srcFileName);
            console.log('path to dest', path.join(destination, srcFileName));
            fs.readFile(path.join(destination, srcFileName), 'utf8', (err, dataDest) => {
              console.log('err3', err);
              console.log('dataDest\n', dataDest);

              csv.parse(dataSrc, parseOptions, (err, dataSrc) => {
                console.log('dataSourcePARSE', dataSrc)
                console.log('err4', err)
              
                csv.parse(dataDest, parseOptions, (err, dataDest) => {
                  console.log('dataDestPARSE', dataDest);
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

                  console.log('finalData before write', finalData);
                  
                  csv.stringify(finalData, (err, output) => {
                    console.log('err5', err)
                    console.log('output', output);
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

// fs.readFile('./source/realDataSrc.csv', 'utf8', (err, dataSrc) => {
//   console.log('err1', err);

//   fs.readFile('./dest/realDataDest.csv', 'utf8', (err, dataDest) => {
//     console.log('err2', err);
//     console.log('dataDest1', dataDest);
  
//     csv.parse(dataSrc, parseOptions, (err, dataSrc) => {
//       console.log('err3', err)

//       csv.parse(dataDest, parseOptions, (err, dataDest) => {
//         console.log('dataDest', dataDest);
//         const noDups = {};

//         dataSrc.forEach(row => {
//           let key = row['Session ID'] + row['Transfer ID']
//           key.length ? noDups[key] = row : null;
//         })

//         dataDest.forEach(row => {
//           let key = row['Session ID'] + row['Transfer ID']
//           key.length ? noDups[key] = row : null;
//         })

//         const finalData = Object.keys(noDups).map(key => noDups[key]);
        
//         csv.stringify(finalData, (err, output) => {
//           console.log('err4', err)
//           console.log('output', output);
//           let finalOutput = 'TimeStamp,HotFolder,Transfer Type,Direction,Local ID,Location,Remote ID,Remote Location,Session ID,Transfer ID,Status,File Size,Data Transferred,Transfer Start time,Transfer stop time,Average Rate (kbps),Peak Rate (kbps),Effective Rate (kbps),Packet Loss %,Remote Host,File Path,Username,Task ID,Task Name,Report Time' + output;
//           fs.writeFile('./dest/realDataDest.csv', finalOutput, (err) => console.log('err5', err)) 
//         });
//       });
//     });
//   });
// });
//   // console.log('dataSrc', dataSrc);



//   // fs.appendFile('./dest/dest1.csv', data, (err) => {
//   //   console.log('err2', err)
//   //   console.log('all done!');
//   // })

