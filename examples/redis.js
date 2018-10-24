const Scheduler = require('../index.js')

const scheduler = Scheduler.createScheduler({
  url: 'redis://127.0.0.1:6379',
  backend: {
    name: 'redis',
    jobHoldingBay: 'myUniqueListKey',
  },
})

scheduler.on('job', job => {
  console.log('Received job', job)
  // should probably execute the job here
})

const myJob = {
  title: 'Great Gig In The Sky',
}

scheduler.delay(myJob, 2000)
