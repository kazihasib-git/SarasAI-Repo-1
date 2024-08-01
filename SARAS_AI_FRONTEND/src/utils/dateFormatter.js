export const dateFormatter = date => {
    // Ensure the date is a Date object
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    // Convert date in MM/DD/YYYY format
    // example July/11/2024

    // to display date in the format of July/11/2024
    // and to send it to the backend in the format of 2024-07-11

    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${month}/${day}/${year}`;
    const formattedDateToSend = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${day}-${year}`;

    return { formattedDate, formattedDateToSend };
};

export const formatDateTime = sessionData => {
    const startDate = new Date(sessionData.start);
    const endDate = new Date(sessionData.end);

    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const formattedDate = startDate.toLocaleDateString('en-US', options);

    const formatTime = date => {
        const hours = date.getHours() % 12 || 12;
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
        return `${hours}:${minutes} ${ampm}`;
    };

    const formattedStartTime = formatTime(startDate);
    const formattedEndTime = formatTime(endDate);

    return `${formattedDate}, ${formattedStartTime} - ${formattedEndTime}`;
};
