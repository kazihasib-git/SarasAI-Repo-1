import moment from 'moment-timezone';
import { timezoneIdToName } from './timezoneIdToName';

async function convertToUTC({ date_slot, start_time, time_end, date_end, time_zone_id }) {
    try {
        const timezone = await timezoneIdToName(time_zone_id);
        
        const fromDateTime = `${date_slot} ${start_time}`;
        const toDateTime = `${date_end} ${time_end}`;

        const fromDateTimeUTC = moment.tz(fromDateTime, timezone).utc();
        const toDateTimeUTC = moment.tz(toDateTime, timezone).utc();

        const obbj = {
            slot_date: fromDateTimeUTC.format('YYYY-MM-DD'),
            from_time: fromDateTimeUTC.format('HH:mm:ss'),
            to_time: toDateTimeUTC.format('HH:mm:ss'),
            end_date: toDateTimeUTC.format('YYYY-MM-DD')
        };

        console.log("UTCDATE==/====/==/===/=///==/==>>>>>>", obbj);
        return obbj;
    } catch (error) {
        console.error('Error in convertToUTC:', error);
        throw error;
    }
}

export { convertToUTC };