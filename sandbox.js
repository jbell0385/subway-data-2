var myDate = new Date();
while (myDate.getDay() !== 2) {
  myDate.setDate(myDate.getDate() - 1);
}

var wisrDate = "";
var year = myDate.getFullYear();
if (myDate.getMonth() < 10) {
  var month = "0" + myDate.getMonth();
} else {
  var month = myDate.getMonth();
}
if (myDate.getDate() < 10) {
  var day = "0" + myDate.getDate();
} else {
  var day = myDate.getDate();
}

wisrDate = year + "-" + month + "-" + day;
