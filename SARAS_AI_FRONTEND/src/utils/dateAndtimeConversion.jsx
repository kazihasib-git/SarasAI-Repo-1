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
        const fromDateTimeUTC = `${start_date} ${start_time}`;
        const toDateTimeUTC = `${end_date} ${end_time}`;

        // Convert from UTC to the specified timezone
        const fromDateTimeLocal = moment
            .tz(fromDateTimeUTC, 'UTC')
            .tz(timezonename);
        const toDateTimeLocal = moment
            .tz(toDateTimeUTC, 'UTC')
            .tz(timezonename);

        const obbj = {
            start_date: fromDateTimeLocal.format('YYYY-MM-DD'),
            start_time: fromDateTimeLocal.format('HH:mm:ss'),
            end_time: toDateTimeLocal.format('HH:mm:ss'),
            end_date: toDateTimeLocal.format('YYYY-MM-DD'),
        };

        // console.log("UTC TO Local=== > ", obbj);
        return obbj;
    } catch (error) {
        console.error('Error in convertToUTC:', error);
        throw error;
    }
}

// async function convertFromUTC({
//     date_slot,
//     start_time,
//     time_end,
//     date_end,
//     timezonename,
// }) {
//     try {
//         const fromDateTimeUTC = `${date_slot} ${start_time}`;
//         const toDateTimeUTC = `${date_end} ${time_end}`;

//         const fromDateTime = moment.utc(fromDateTimeUTC).tz(timezonename);
//         const toDateTime = moment.utc(toDateTimeUTC).tz(timezonename);

//         console.log("FormDataTime", fromDateTime, "toDateTime", toDateTime, timezonename)

//         const result = {
//             slot_date: fromDateTime.format('YYYY-MM-DD'),
//             from_time: fromDateTime.format('HH:mm:ss'),
//             to_time: toDateTime.format('HH:mm:ss'),
//             end_date: toDateTime.format('YYYY-MM-DD'),
//         };

//         console.log('LocalTime==/====/==/===/=///==/==>>>>>>', result);
//         return result;
//     } catch (error) {
//         console.error('Error in convertFromUTC:', error);
//         throw error;
//     }
// }

export { convertFromUTC };
