export const formatTime = time => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);
    const ampm = hour >= 12 ? 'pm' : 'am';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute < 10 ? '0' : ''}${minute} ${ampm}`;
};