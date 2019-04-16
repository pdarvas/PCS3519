const fetchData = require('./demandCalc')
const cors = require('cors');

const express = require('express')
const app = express()
const port = 3001

app.use(cors());

app.get('/', (req, res) => {
  console.log(req.query['interval'])
  fetchData(req.query['interval'] || 'DAY', req.query['price'] || 1, req.query['lab'] || 'labsoft').then((data) => {
    res.json(data)
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
