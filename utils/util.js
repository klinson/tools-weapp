const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const year = date => {
  return date.getFullYear()
}

const now_year = () => {
  return year(new Date())
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const nowTimestamp = () => {
  return Date.parse(new Date());
}

module.exports = {
  formatTime: formatTime,
  year: year,
  now_year: now_year,
  nowTimestamp: nowTimestamp,
}
