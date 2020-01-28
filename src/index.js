const app = require("./app")
const { connectInfluxDB } = require("./influxDB")

const { INFLUXDB_DSN, QUERY } = process.env

function checkEnv() {
  if (!INFLUXDB_DSN) {
    throw new Error(`INFLUXDB_DSN environment variable is not set. exiting`)
  }
  if (!QUERY) {
    throw new Error(`QUERY environment variable is not set. exiting`)
  }
}

function main() {
  checkEnv()
  connectInfluxDB(INFLUXDB_DSN)
  app.listen(process.env.PORT || 8080, () => {
    // eslint-disable-next-line no-console
    console.log("Server start!")
  })
}

main()
