const Scheduler = require('../index.js')

const scheduler = Scheduler.createScheduler({
  backend: {
    name: 'memory',
    jobHoldingBay: 'myTestHoldingKey',
  },
})
const now = Date.now()

scheduler.on('job', job => {
  console.log('Received job', job)
  const end = Date.now()
  console.log('duration', end - now)
  // exit
  process.exit(0)
})

const myJob = {
  title: 'Great Gig In The Sky',
}

scheduler.delay(myJob, 10)

setTimeout(() => {
  // if this fires something is broken
  console.error('This should not be called')
  process.exit(1)
}, 8000)
