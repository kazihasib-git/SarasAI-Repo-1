import moment from 'moment-timezone';

async function convertFromUTC({
    start_date,
    start_time,
    end_time,
    end_date,
    timezonename,
}) {
    try {
        // Combine date and time for the start and end times
        const fromDateTimeUTC = moment.utc(
            `${start_date} ${start_time}`,
            'YYYY-MM-DD HH:mm:ss'
        );
        const toDateTimeUTC = moment.utc(
            `${end_date} ${end_time}`,
            'YYYY-MM-DD HH:mm:ss'
        );

        // Convert from UTC to the specified timezone
        const fromDateTimeLocal = fromDateTimeUTC.tz(timezonename);
        const toDateTimeLocal = toDateTimeUTC.tz(timezonename);

        const obj = {
            start_date: fromDateTimeLocal.format('YYYY-MM-DD'),
            start_time: fromDateTimeLocal.format('HH:mm:ss'),
            end_time: toDateTimeLocal.format('HH:mm:ss'),
            end_date: toDateTimeLocal.format('YYYY-MM-DD'),
        };

        return obj;
    } catch (error) {
        console.error('Error in convertFromUTC:', error);
        throw error;
    }
}

export { convertFromUTC };
