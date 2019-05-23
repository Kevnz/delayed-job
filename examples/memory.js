const Scheduler = require('../index.js')

const scheduler = Scheduler.createScheduler({
  backend: {
    name: 'memory',
    jobHoldingBay: 'doSomethingCoolKey',
  },
})

scheduler.on('job', job => {
  console.info('Received job', job)
  // should probably execute the job here
  console.info(`send email maybe to ${job.data.email}`)
})

const myJob = {
  title: 'Great Gig In The Sky',
  task: 'email1',
  data: {
    email: 'emailme@example.com',
    firstName: 'Test',
    lastName: 'User',
  },
}
const myJob2 = {
  title: 'Second Gig In The Sky',
  task: 'email2',
  data: {
    email: 'emailmemore@example.com',
    firstName: 'Just',
    lastName: 'Auser',
  },
}
scheduler.delay(myJob, 2000)
scheduler.delay(myJob2, 14000)
