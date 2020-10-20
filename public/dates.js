exports.dateYesterday = function() {
  return dateYesterday = new Date(),
  dateYesterday.getDate() - 1,
  dateYesterday.toISOString().slice(0, 10);
};
exports.today = function() {
  return today = new Date(),
  today.toISOString().slice(0, 10);
};

exports.dayYesterday = function() {
  return dayYesterday = new Date(),
  dayYesterday = new Date(),
  days = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
  ],
  dayYesterday.setDate(dayYesterday.getDate() - 1),
  dayYesterday = days[dayYesterday.getDay()];
};


exports.dateTomorrow = function() {
  return dateTomorrow = new Date(),
  dateTomorrow.setDate(dateTomorrow.getDate() + 1),
  dateTomorrow.toISOString().slice(0, 10);
};

exports.dayTomorrow = function() {
  return dayTomorrow = new Date(),
  futureDays = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
  ],
  dayTomorrow.setDate(dayTomorrow.getDate() + 1),
  dayTomorrow = futureDays[dayTomorrow.getDay()];
};


