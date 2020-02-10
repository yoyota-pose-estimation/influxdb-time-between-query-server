const bodyParser = require("body-parser")
const compression = require("compression")
const express = require("express")
const helmet = require("helmet")
const morgan = require("morgan")

const { queryWithTimeRange } = require("./influxDB")

const app = express()

app.use(morgan("tiny"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(compression())
app.use(helmet())

app.get("/health", (_, res) => {
  res.status(204).send()
})

app.get("/", async (req, res) => {
  const { time } = req.query
  const result = await queryWithTimeRange(process.env.QUERY, parseInt(time, 10))
  const closestResult = result[Math.trunc(result.length / 2)]
  if (!closestResult) {
    res.json({})
    return
  }
  res.json({
    ...closestResult,
    time: parseInt(closestResult.time.getNanoTime(), 10)
  })
})

module.exports = app
