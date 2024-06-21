export const timeZones = [
    { value: 'PST', label: 'Pacific Standard Time' },
    { value: 'MST', label: 'Mountain Standard Time' },
    { value: 'IST', label: 'Indian Standard Time' },
    // Add more time zones here
  ];
  
  export const genders = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];
  
  export const qualificationOptions = [
    { value: 'highschool', label: 'High School' },
    { value: 'bachelor', label: 'Bachelor\'s Degree' },
    { value: 'master', label: 'Master\'s Degree' },
  ];
  
  export const validateTimeZone = (value) => {
    if (!value) return 'Time Zone is required';
    if (!timeZones.some(tz => tz.value === value)) return 'Invalid time zone selected';
    return true;
  };
  