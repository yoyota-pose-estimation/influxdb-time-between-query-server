const Influx = require("influx")

let influx

function connectInfluxDB(dataSourceName) {
  influx = new Influx.InfluxDB(dataSourceName)
  return influx
}

function queryWithTimeRange(
  query,
  time = new Date().getTime(),
  timeRange = 5 * 10 ** 7
) {
  return influx.query(
    `${query} WHERE ${time - timeRange} < time AND time < ${time + timeRange}`
  )
}

module.exports = {
  connectInfluxDB,
  queryWithTimeRange
}
