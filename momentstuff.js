moment().add(7, 'days').add(1, 'months'); // with chaining
moment().add({days:7,months:1}); // with object literal

var m = moment(new Date(2011, 2, 12, 5, 0, 0)); // the day before DST in the US
m.hours(); // 5
m.add(1, 'days').hours(); // 5

var duration = moment.duration({'days' : 1});
moment([2012, 0, 31]).add(duration); // February 1

var a = moment().subtract(1, 'day');
var b = moment().add(1, 'day');
