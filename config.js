module.exports = {
  source: './source',
  destination: './dest',
  srcFileName: 'hotfolder_data_report.csv',
  headers: ['TimeStamp','HotFolder','Transfer Type','Direction','Local ID','Location','Remote ID','Remote Location','Session ID','Transfer ID','Status','File Size','Data Transferred','Transfer Start time','Transfer stop time','Average Rate (kbps)','Peak Rate (kbps)','Effective Rate (kbps)','Packet Loss %','Remote Host','File Path','Username','Task ID','Task Name','Report Time'],
  interval: 20000
}