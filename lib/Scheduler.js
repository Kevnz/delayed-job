const EventEmitter = require('events').EventEmitter
const util = require('util')

util.inherits(Scheduler, EventEmitter)
module.exports = Scheduler

/**
 * Scheduler
 * @param {Object} opts Object containing configuration
 * @param {Object} opts.backend Object containing backend connection options
 * @param {Number} opts._pollInterval Number of second with which we will
 *                                    poll the database
 */
function Scheduler(opts) {
  EventEmitter.call(this)

  opts = opts || {}

  // Check whether a backend was provided
  if (opts.backend) {
    this._backend = require('./db/' + opts.backend.name).createDB(opts)
  } else {
    this._backend = require('./db/redis.js').createDB()
  }

  // Check whether a poll interval was provided.
  this._pollInterval = opts.pollInterval || 5000

  // On instantiation assume we are locked
  this.locked = true

  clearInterval(this._iv)
  this._iv = setInterval(loop.bind(this), this._pollInterval)
}

/**
 * Delay a job by a certain timeout
 * @param  {Object} job     Payload to delay
 * @param  {Number} timeout Seconds to delay this job by
 * @param  {Function} cb    Callback
 */
Scheduler.prototype.delay = function(job, timeout) {
  this._backend.insertJob(job, timeout)
}

Scheduler.prototype.clear = function() {
  clearInterval(this._iv)
}

async function loop() {
  const until = this._pollInterval
  await this._backend.lock()
  const jobs = await this._backend.fetchJobs(until)

  await this._backend.unlock()

  if (jobs === undefined) return
  jobs.forEach(job => {
    this.emit('job', job)
  })
}
