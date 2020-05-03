const sum = (arr=[]) => arr.reduce((a,b) => +a + +b, [])

const minuteInTimeInterval = {
  mins: 1,
  min: 1,
  minutes: 1,
  minute: 1,
  hours: 60,
  hour: 60,
  day: 60 * 24,
  days: 60 * 24,
}
const timeIntervals = Object.keys(minuteInTimeInterval)

parseTime("< 3 minutes")        => [ 3,   3]
parseTime("1 - 5 hours")        => [60, 300]
parseTime("1 minute - 2 hours") => [ 1, 120]

const parseTime = str => {
  const parts = str
    .replace(/>|</g, "") // remove any < or > symbols
    .split(/\s|,|(-)/g)  // split on spaces, , and - (but keep in array)
    .filter(d => d)      // remove empty strings

  let runningMinutes = [0]
  let runningNumbers = []
  let isTimeRange = false

  parts.forEach(part => {
    // remove non-digit or . chars
    const digitString = part.replace(/\d|\./g, "")
    const isNumber = digitString.length == 0
    const isTimeInterval = timeIntervals.includes(part)

    if (isNumber) {
      const number = +part

      if (isTimeRange) {
        runningNumbers.push([number])
      } else {
        if (!runningNumbers[runningNumbers.length - 1]) {
          runningNumbers.push([])
        }
        runningNumbers[runningNumbers.length - 1].push(number)
      }
    } else if (part == "-") {
      // switch to a time range if we find a -
      isTimeRange = true

    } else if (isTimeInterval) {
      if (isTimeRange) {
        runningMinutes = runningNumbers.map((number, i) => (
          +(runningMinutes[i] || 0)
          + +sum(number.map(d => (
            d * minuteInTimeInterval[part]
          )))
        ))
      } else {
        runningMinutes = [
          +(runningMinutes[0] || 0)
          + +sum(
            (runningNumbers[0] || [3])
              .map(d => (
                d * minuteInTimeInterval[part]
              ))
          )
        ]
      }

      // reset numbers & is time range flag
      runningNumbers = []
      isTimeRange = false
    }
  })

  // if we don't have an end time, duplicate our first time
  if (!runningMinutes[1]) runningMinutes[1] = runningMinutes[0]
  return runningMinutes
}