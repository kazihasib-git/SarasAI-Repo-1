import axiosInstance from '../redux/services/httpService';

import { baseUrl } from './baseURL';

export const timezoneIdToName = timezoneId => {
    console.log('timezoneIdToName hit:', timezoneId);
    try {
        const response = axiosInstance.get(`${baseUrl}/timezones`);
        const timezones = response.data;
        console.log('Timezones:', timezones);
        const timezone = timezones.find(tz => tz.id === timezoneId);
        return timezone ? timezone.time_zone : 'Unknown Timezone';
    } catch (error) {
        console.error('Error fetching timezones:', error);
        return 'Unknown Timezone';
    }
};
