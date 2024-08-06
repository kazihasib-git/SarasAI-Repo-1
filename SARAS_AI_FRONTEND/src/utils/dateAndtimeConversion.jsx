const moment = require('moment-timezone');

function convertLocalToUTCdate(localDate, timeZone) {
    // Parse the local date in the specified timezone and convert it to UTC
    const utcDate = moment.tz(localDate, timeZone).utc().format('YYYY-MM-DD');

    return utcDate;
}

export {convertLocalToUTCdate} ; 








