const Scheduler = require('../index.js')

const scheduler = Scheduler.createScheduler({
  backend: {
    name: 'redis',
    jobHoldingBay: 'myTestHoldingKey',
  },
})

scheduler.on('job', job => {
  console.log('Received job', job)
  // exit
  process.exit(0)
})

const myJob = {
  title: 'Great Gig In The Sky',
}

scheduler.delay(myJob, 1000)

setTimeout(() => {
  // if this fires something is broken
  process.exit(1)
}, 8000)
