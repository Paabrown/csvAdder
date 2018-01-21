const CronJob = require('cron').CronJob;
const { csvAdd } = require('./csvAdd.js');

const options = {
  cronTime: '00 * * * * *',
  onTick: () => csvAdd(),
  start: true, /* Start the job right now */
  timeZone: 'America/New_York', /* Time zone of this job. */
  runOnInit: true
}

const job = new CronJob(options);

job.start();

console.log('job running?', job.running);
