import axiosInstance from '../redux/services/httpService';

// Function to get time_zone by id
async function timezoneIdToName(id) {
    try {
        // Make the API call using the custom Axios instance
        const response = await axiosInstance.get('/timezones');

        // Extract the data from the response
        const timezones = response.data;

        // Find the timezone object with the matching id
        const timezone = timezones.find(tz => tz.id === id);

        // Return the time_zone if found, otherwise return null
        return timezone ? timezone.time_zone : null;
    } catch (error) {
        console.error('Error fetching timezones:', error);
        return null;
    }
}

export { timezoneIdToName };
