var Schedule = require('./lib/Scheduler.js')

exports.createScheduler = function(opts) {
  return new Schedule(opts);
}
