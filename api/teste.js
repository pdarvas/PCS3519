const PRECO_DEMANDA = 1
const PRECO_ULT = 3*PRECO_DEMANDA

const calculatePrice = (values, demanda) => {
  const sum = values.reduce((acc, val) => {
    if (parseFloat(val.total_avg) > 1.1 * demanda) {
      return acc + demanda*PRECO_DEMANDA + (parseFloat(val.total_avg) - demanda)*PRECO_ULT
    } else if (parseFloat(val.total_avg) < demanda) {
      return acc + demanda*PRECO_DEMANDA
    }
    return acc + parseFloat(val.total_avg)*PRECO_DEMANDA
  }, 0)
  return sum
}

const calculateIdeal = (values) => {
  let demanda = 380
  let rightLimit = calculatePrice(values, demanda)
  let leftLimit = 0
  let delta = 0.01
  let hitLeft = 1
  while(hitLeft < 2) {
    const newValue = calculatePrice(values, demanda - delta)
    if (newValue < rightLimit) {
      demanda -= delta
      rightLimit = newValue
      delta *= 2
      hitLeft = 0
    }
    if (newValue > rightLimit) {
      leftLimit = newValue
      delta = 0.01
      hitLeft += 1
    }
  }
  return demanda
}

const medicoes = [
  {
    total_avg: '204.7'
  },
  {
    total_avg: '232.9'
  },
  {
    total_avg: '261.6'
  },
  {
    total_avg: '267.6'
  },
  {
    total_avg: '239.4'
  },
  {
    total_avg: '200.3'
  },
  {
    total_avg: '184.8'
  },
  {
    total_avg: '209'
  },
  {
    total_avg: '239.2'
  },
  {
    total_avg: '211.8'
  },
  {
    total_avg: '255.8'
  },
  {
    total_avg: '262.7'
  },
]

calculateIdeal(medicoes)
