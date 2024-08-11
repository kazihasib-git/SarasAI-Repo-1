import moment from 'moment-timezone';
import { timezoneIdToName } from './timezoneIdToName';

async function convertToUTC({ date_slot, start_time, time_end, date_end, timezonename }) {
    try {
        
        
        const fromDateTime = `${date_slot} ${start_time}`;
        const toDateTime = `${date_end} ${time_end}`;

        const fromDateTimeUTC = moment.tz(fromDateTime, timezonename).utc();
        const toDateTimeUTC = moment.tz(toDateTime, timezonename).utc();

        const obbj = {
            slot_date: fromDateTimeUTC.format('YYYY-MM-DD'),
            from_time: fromDateTimeUTC.format('HH:mm:ss'),
            to_time: toDateTimeUTC.format('HH:mm:ss'),
            end_date: toDateTimeUTC.format('YYYY-MM-DD'),
        };

        console.log('UTCDATE==/====/==/===/=///==/==>>>>>>', obbj);
        return obbj;
    } catch (error) {
        console.error('Error in convertToUTC:', error);
        throw error;
    }
}


async function convertFromUTC({ date_slot, start_time, time_end, date_end, timezonename }) {
    try {
      
        
        const fromDateTimeUTC = `${date_slot} ${start_time}`;
        const toDateTimeUTC = `${date_end} ${time_end}`;

        const fromDateTime = moment.utc(fromDateTimeUTC).tz(timezonename);
        const toDateTime = moment.utc(toDateTimeUTC).tz(timezonename);

        const result = {
            slot_date: fromDateTime.format('YYYY-MM-DD'),
            from_time: fromDateTime.format('HH:mm:ss'),
            to_time: toDateTime.format('HH:mm:ss'),
            end_date: toDateTime.format('YYYY-MM-DD')
        };

        console.log("LocalTime==/====/==/===/=///==/==>>>>>>", result);
        return result;
    } catch (error) {
        console.error('Error in convertFromUTC:', error);
        throw error;
    }
}


export { convertToUTC ,convertFromUTC };