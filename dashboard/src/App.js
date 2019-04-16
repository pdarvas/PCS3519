import React, { useState, useEffect } from 'react'
import './App.css'
import {
  ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend,
} from 'recharts'
import axios from 'axios'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { TextField } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

const App = (props) => {
  const [data, setData] = useState([])
  const [interval, setInterval] = useState('MONTH')
  const [calculatedPrice, setCalculatedPrice] = useState(0)
  const [price, setPrice] = useState(1)
  const [controlledPrice, setControlledPrice] = useState(1)
  const [lab, setLab] = useState('labsoft')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    axios.get('http://localhost:3001', {params: {interval, price, lab}}).then((response) => {
      setData(response.data.values)
      setCalculatedPrice(response.data.price)
      setLoading(false)
    })
  }, [interval, price, lab])

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)

    switch (interval) {
      case 'MONTH':
      case 'WEEK':
      case 'DAY':
        return `${formatNumber(date.getUTCDate())}/${formatNumber(date.getUTCMonth())}`
      case 'HOUR':
      default:
        return `${formatNumber(date.getUTCHours())}:${formatNumber(date.getUTCMinutes())}`
    }

  }

  const handleChange = (ev) => {
    setInterval(ev.target.value)
  }

  return (
    <div className="App">
      <Loading loading={loading}/>
      <h1>Calculadora de demanda ótima</h1>
      <div style={{display: 'flex'}}>
        <Button variant="contained" style={{margin: '10px'}} disabled={lab === 'labsoft'}
                onClick={() => setLab('labsoft')}>
          LabSoft
        </Button>
        <Button variant="contained" style={{margin: '10px'}} disabled={lab === 'labprog'}
                onClick={() => setLab('labprog')}>
          LabProg
        </Button>
      </div>
      <ComposedChart
        width={1000}
        height={400}
        data={data}
        margin={{
          top: 20, right: 80, bottom: 20, left: 20,
        }}
      >
        <CartesianGrid stroke="#f5f5f5"/>
        <XAxis dataKey="time" label={{value: 'Tempo', position: 'insideBottomRight', offset: 0}}
               tickFormatter={formatDate}/>
        <YAxis label={{value: 'Potência', angle: -90, position: 'insideLeft'}}/>
        <Tooltip/>
        <Legend/>
        <Area type="monotone" dataKey="total" fill="#8884d8" stroke="#8884d8"/>
        <Line type="monotone" dataKey="ideal" stroke="#ff7300" dot={false}/>
      </ComposedChart>
      <div style={{display: 'grid', gridGap: '30px', gridTemplateRows: '1fr', gridTemplateColumns: 'auto auto auto'}}>
        <FormControl variant="outlined" style={{minWidth: '120px'}}>
          <InputLabel htmlFor="outlined-age-simple">
            Intervalo
          </InputLabel>
          <Select
            value={interval}
            onChange={handleChange}
            input={
              <OutlinedInput labelWidth={60} name="age" id="outlined-age-simple"/>
            }
          >
            <MenuItem value={'MONTH'}>
              Mês
            </MenuItem>
            <MenuItem value={'WEEK'}>Semana</MenuItem>
            <MenuItem value={'DAY'}>Dia</MenuItem>
            <MenuItem value={'HOUR'}>Hora</MenuItem>
          </Select>
        </FormControl>
        <TextField
          type={'number'}
          onBlur={(ev) => setPrice(ev.target.value)}
          onChange={(ev) => setControlledPrice(ev.target.value)}
          value={controlledPrice}
          label={'Preço kW/h em R$'}
        />
        <p>
          {`Preço total: R$${calculatedPrice.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
            .replace(/\./g, ';').replace(/,/g, '.')
            .replace(/;/g, ',')}`}
        </p>
      </div>
    </div>
  )

}

const formatNumber = (number) => {
  return number >= 10 ? `${number}` : `0${number}`
}

const Loading = ({loading}) => {
  return <div style={{display: loading ? 'block' : 'none', position: 'absolute', top: '50%', left: '50%', transform: 'translateXY(-50%, -50%)'}}>
    <CircularProgress />
  </div>
}

export default App
