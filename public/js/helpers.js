// https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
function timeConverter(UNIX_timestamp) {
    let a = new Date(Number(UNIX_timestamp));
    var year = a.getFullYear();
    var month = a.getMonth();
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time =
        date + "/" + month + "/" + year + " " + hour + ":" + min + ":" + sec;
    return time;
}

function cleanString(instr) {
    // console.log(instr);
    const outsrt = instr.replace(/[^\w\s]/gi, "");
    // console.log(outsrt);
    return outsrt;
}