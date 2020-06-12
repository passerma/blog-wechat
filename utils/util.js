const translateDate = (createtime, need) => {
  let date = new Date(createtime);
  let year = date.getFullYear();
  let month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  let newDate = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
  if (need) {
      let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
      let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
      return `${year}-${month}-${newDate} ${h}:${m}`
  }
  return `${year}-${month}-${newDate}`
}
const translateText = (text) => {
  return text.replace(/&nbsp;/gi, '')
}

module.exports = {
  translateDate,
  translateText
}
