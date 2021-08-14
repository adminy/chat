const zeroPad = (num, pad) => String(num).padStart(pad, '0')

export const isSameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()

const formats = {
  'HH:mm': date => `${zeroPad(date.getHours(), 2)}:${zeroPad(date.getMinutes(), 2)}`,
  'DD MMMM YYYY': date => `${new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', day: 'numeric' }).format(date)}`,
  'DD/MM/YY': date => `${new Intl.DateTimeFormat('en-GB', { month: 'numeric', year: 'numeric', day: 'numeric' }).format(date)}`,
  'DD MMMM, HH:mm': date => `${new Intl.DateTimeFormat('en-GB', { month: 'long', day: 'numeric' }).format(date)}, ${zeroPad(date.getHours(), 2)}:${zeroPad(date.getMinutes(), 2)}`
}

export const parseTimestamp = (timestamp, format = '') => {
  const date = timestamp && timestamp.seconds ? new Date(timestamp.seconds * 1000) : timestamp
  return formats[format] ? formats[format]() : date
}
