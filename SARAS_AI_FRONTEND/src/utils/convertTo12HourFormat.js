export function convertTo12HourFormat(time24) {
    // Split the time into hours, minutes, and seconds
    const [hours, minutes, seconds] = time24.split(':').map(Number);

    const suffix = hours >= 12 ? 'PM' : 'AM';

    const hours12 = hours % 12 || 12;

    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${hours12}:${formattedMinutes} ${suffix}`;
}