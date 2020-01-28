const Influx = require("influx")
const { connectInfluxDB, queryWithTimeRange } = require("./influxDB")

const testInfluxDBDSN = "http://localhost:8086/test"
test("test connect influxDB", async () => {
  const influx = connectInfluxDB(testInfluxDBDSN)
  const pong = await influx.ping(1000)
  expect(pong).toBeInstanceOf(Array)
})

describe("query test", () => {
  let influx
  beforeAll(async () => {
    influx = new Influx.InfluxDB(testInfluxDBDSN)
    await influx.createDatabase("test")
  })
  beforeEach(() => {
    connectInfluxDB(testInfluxDBDSN)
  })
  test("test query with time range", async () => {
    const now = new Date().getTime()
    await influx.writePoints([
      {
        fields: { value: 0.64 },
        measurement: "cpu_load_short",
        timestamp: now
      }
    ])
    const query = `SELECT "value" FROM "cpu_load_short"`
    const result = await queryWithTimeRange(query, now)
    expect(result.length).not.toBe(0)
    expect(result[0].value).toBe(0.64)
  })
})
