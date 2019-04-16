const knex = require('knex')({
  client: 'pg',
  connection: {
    host : '143.107.102.7',
    user : 'aluno',
    password : 'labsoft',
    database : 'medicoes'
  }
});

const calculatePrice = (values, demanda, preco) => {
  const sum = values.reduce((acc, val) => {
    if (parseFloat(val.total_avg) > 1.1 * demanda) {
      return acc + demanda * preco + (parseFloat(val.total_avg) - demanda) * preco * 3
    } else if (parseFloat(val.total_avg) < demanda) {
      return acc + demanda*preco
    }
    return acc + parseFloat(val.total_avg)*preco
  }, 0)
  return sum
}

const calculateIdeal = (values, price) => {
  let demanda = Math.max(...values.map(val => val.total_avg))/1.1
  let rightLimit = calculatePrice(values, demanda, price)
  let delta = 100
  while(1) {
    const newValue = calculatePrice(values, demanda - delta, price)
    if (newValue < rightLimit) {
      demanda -= delta
      rightLimit = newValue
    }
    if (newValue > rightLimit) {
      if (delta === 1)
        return demanda
      demanda += delta
      rightLimit = calculatePrice(values, demanda, price)
      delta /= 10
    }
  }
}

const getIntervalString = (interval) => {
  switch(interval) {
    case 'MONTH':
      return '4 weeks'
    case 'WEEK':
      return '1 week'
    case 'DAY':
      return '1 day'
    case 'HOUR':
      return '1 hour'
  }
}

const getIntervalPrice = (interval, price) => {
  switch(interval) {
    case 'MONTH':
      return 720 * price
    case 'WEEK':
      return 168 * price
    case 'DAY':
      return 24 * price
    case 'HOUR':
      return price
  }
}

module.exports = async (interval, price, lab) => {
  console.log(lab)
  const data = await knex.select(knex.raw(`time_bucket(\'${getIntervalString(interval)}\', time) AS time_group`), knex.raw('max(total) as total_avg'))
    .from(`med_${lab}`)
    .groupBy('time_group')
    .orderBy('time_group', 'desc')
  const ideal = calculateIdeal(data, getIntervalPrice(interval, price))
  const calculatedPrice = calculatePrice(data, ideal, getIntervalPrice(interval, price))
  console.log(calculatedPrice)
  return {values: data.map((val) => ({time: val.time_group.getTime(), total: val.total_avg, ideal})).reverse(), price: calculatedPrice}
}
