const Redis = require('ioredis')

exports.createDB = function(opts) {
  return new DB(opts.url || 'redis://127.0.0.1:6379')
}

function DB(opts) {
  // TODO figure out opts
  this._conn = new Redis(opts)

  opts = opts || {}

  this._holdingListKey = opts.jobHoldingBay || 'holdingListKey'
  this._semaphorName = ['delayed', Math.round(Math.random() * 100)].join(':')
}

DB.prototype.lock = async function(fn) {
  this.locked = true
  await this._conn.set(this._semaphorName, '1')
  this.locked = false
}

DB.prototype.unlock = async function() {
  await this._conn.del(this._semaphorName)
}
const jobPicker = endExecutionTime => (accum, current, index, arr) => {
  if (index % 2 === 0) {
    const jobId = current
    const jobExecutionDate = parseInt(arr[index + 1])
    if (isNaN(jobExecutionDate)) {
      throw new Error('fetchJobs - jobExecutionDate is not a number')
    }
    if (jobExecutionDate <= endExecutionTime) {
      accum.push(jobId)
    }
  }
  return accum
}
/**
 * Fetch all jobs to be executed between now and an end date
 * @param  {Number}   until Timestamp, end date to fetch jobs
 */
DB.prototype.fetchJobs = async function(until) {
  const results = await this._conn.zrange(
    this._holdingListKey,
    0,
    -1,
    'WITHSCORES'
  )

  const endExecutionTime = new Date().getTime() + until

  const matchingJobs = results.reduce(jobPicker(endExecutionTime), [])

  if (matchingJobs.length === 0) return matchingJobs
  else {
    await this._conn.zrem(this._holdingListKey, matchingJobs)
    return matchingJobs.map(JSON.parse)
  }
}

DB.prototype.insertJob = function(job, timeout) {
  const jobExecutionDate = new Date().getTime() + timeout

  return this._conn.zadd(
    this._holdingListKey,
    jobExecutionDate,
    JSON.stringify(job)
  )
}
