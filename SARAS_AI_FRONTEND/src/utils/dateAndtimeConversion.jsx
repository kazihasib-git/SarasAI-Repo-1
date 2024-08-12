import moment from 'moment-timezone';

async function convertFromUTC({ start_date, start_time, end_time, end_date, timezonename }) {
    try {
        // Combine date and time for the start and end times
        const fromDateTimeUTC = `${start_date} ${start_time}`;
        const toDateTimeUTC = `${end_date} ${end_time}`;

        // Convert from UTC to the specified timezone
        const fromDateTimeLocal = moment.tz(fromDateTimeUTC, 'UTC').tz('America/New_York');
        const toDateTimeLocal = moment.tz(toDateTimeUTC, 'UTC').tz('America/New_York');

        const obbj = {
            start_date: fromDateTimeLocal.format('YYYY-MM-DD'),
            start_time: fromDateTimeLocal.format('HH:mm:ss'),
            end_time: toDateTimeLocal.format('HH:mm:ss'),
            end_date: toDateTimeLocal.format('YYYY-MM-DD')
        };

        // console.log("UTC TO Local=== > ", obbj);
        return obbj;
    } catch (error) {
        console.error('Error in convertFromUTC:', error);
        throw error;
    }
}

export {convertFromUTC };