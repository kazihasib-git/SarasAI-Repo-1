import moment from 'moment-timezone';

async function convertFromUTC({ slot_date, from_time, to_time, end_date, timezonename }) {
    try {
        // Combine date and time for the start and end times
        const fromDateTimeUTC = `${slot_date} ${from_time}`;
        const toDateTimeUTC = `${end_date} ${to_time}`;

        // Convert from UTC to the specified timezone
        const fromDateTimeLocal = moment.tz(fromDateTimeUTC, 'UTC').tz(timezonename);
        const toDateTimeLocal = moment.tz(toDateTimeUTC, 'UTC').tz(timezonename);

        const obbj = {
            date_slot: fromDateTimeLocal.format('YYYY-MM-DD'),
            start_time: fromDateTimeLocal.format('HH:mm:ss'),
            time_end: toDateTimeLocal.format('HH:mm:ss'),
            date_end: toDateTimeLocal.format('YYYY-MM-DD')
        };

        console.log("UTC TO Local=== > ", obbj);
        return obbj;
    } catch (error) {
        console.error('Error in convertFromUTC:', error);
        throw error;
    }
}

export {convertFromUTC };