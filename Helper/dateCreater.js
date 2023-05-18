const today = new Date();
let day = today.getDate();
let month = today.getMonth() + 1;
let year = today.getFullYear();

if (month < 10) {
  month = "0" + month;
}
if (day < 10) {
  day = "0" + day;
}

const dateForToday = year + "-" + month + "-" + day;

module.exports = dateForToday;
