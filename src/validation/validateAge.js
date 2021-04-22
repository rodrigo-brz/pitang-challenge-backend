const moment = require('moment')

function validateAge(newUser) {
  const newUserMoment = moment(newUser.birthday)
  const currentTime = moment(new Date())
  if (currentTime.diff(newUserMoment, 'years') >= 60) {
    return true
  }
  return false
}

module.exports = validateAge
