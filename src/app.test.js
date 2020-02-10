const request = require("supertest")
const app = require("./app")
const Influx = require("influx")
const { connectInfluxDB } = require("./influxDB")

const testInfluxDBDSN = "http://localhost:8086/test"

test("test health route", async () => {
  const res = await request(app).get("/health")
  expect(res.status).toEqual(204)
})

test("test root route", async () => {
  process.env.QUERY = `SELECT "value" FROM "cpu_load_short"`
  connectInfluxDB(testInfluxDBDSN)
  const influx = new Influx.InfluxDB(testInfluxDBDSN)
  await influx.createDatabase("test")

  const now = new Date()
  await influx.writePoints([
    {
      fields: { value: 0.64 },
      measurement: "cpu_load_short",
      timestamp: now
    }
  ])

  const nanoTimeNow = now.getTime() * 10 ** 6
  const res = await request(app).get(`/?time=${nanoTimeNow}`)
  const { value, time } = res.body
  expect(value).toBe(0.64)
  expect(time).toBe(nanoTimeNow)
})
