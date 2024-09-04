export function formatDateFromLocalToTimezone(date, utcOffset) {
    const localDate = new Date(date);
    const offset = utcOffset * 60 * 60000; // Convert the utcOffset to milliseconds
    const adjustedDate = new Date(localDate.getTime() + offset);
    return adjustedDate.toISOString().split('T')[0];
}