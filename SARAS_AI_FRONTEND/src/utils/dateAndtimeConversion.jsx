import moment from 'moment-timezone';
import { timezoneIdToName } from './timezoneIdToName';

function convertToUTC({ fromDate, fromTime, toTime, toDate, timezone_id }) {
    const timezone = timezoneIdToName(timezone_id);
    // Combine date and time for fromTime and toTime
    const fromDateTime = `${fromDate} ${fromTime}`;
    const toDateTime = `${toDate} ${toTime}`;

    // Convert to UTC using moment-timezone
    const fromDateTimeUTC = moment.tz(fromDateTime, timezone).utc().format();
    const toDateTimeUTC = moment.tz(toDateTime, timezone).utc().format();

    const obbj = {
        slot_date: fromDateTimeUTC.split('T')[0], // Extracting date part
        from_time: fromDateTimeUTC.split('T')[1], // Extracting time part
        to_time: toDateTimeUTC.split('T')[1], // Extracting time part
        end_date: toDateTimeUTC.split('T')[0],
    };

    console.log(' UTCDATE==/====/==/===/=///==/==>>>>>>', obbj);
    return obbj;
}

export { convertToUTC };
