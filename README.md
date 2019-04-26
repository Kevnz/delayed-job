# delayed-job

delayed-job is a horizontally scalable Node.js implementation of Ruby's delayed_job. Using semaphore locks it aims to provide an atomic interface to a federation of workers operating on the same job queue. Initial work has focussed on a Redis backed database, however more backend implementations are possible.

![delayed-job](https://kevinisom.info/delayed-job/delayed-job.png)

## Installation

```bash
npm install @kev_nz/delayed-job
```

## Usage

```javascript
const Scheduler = require('@kev_nz/delayed-job')

const schedule = Scheduler.createSchedule({
  url: '',
  backend: {
    name: 'redis', // memory is also available
    jobHoldingBay: 'myUniqueListKey'
  }
})

schedule.on('job', job => {
  console.log('Received job',job);
})

const myJob = {
  title: 'Great Gig In The Sky'
}

schedule.delay(myJob, 2000)
```

## API

### schedular.delay(job, timeout)

Schedule a job for execution

## Assumptions

* errors thrown will result in re-establishing the scheduler [expand]
* Single atomic source of truth
* Db interactions are also atomic
* Jobs emitted have no immediate relationship to one another

## Prior Art

Originally based on [https://github.com/thatguydan/delayed-job](https://github.com/thatguydan/delayed-job) But that project hasn't been update in six years