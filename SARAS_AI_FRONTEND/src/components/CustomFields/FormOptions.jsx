export const timeZones = [
  { value: 'PST', label: 'Pacific Standard Time' },
  { value: 'MST', label: 'Mountain Standard Time' },
  { value: 'IST', label: 'Indian Standard Time' },
  // Add more time zones here
];

export const genders = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' }
];

export const qualificationOptions = [
  { value : 'Secondary_School', label : 'Seconday School'},
  { value : 'Post Secondary School', label : 'Post Secondary School'},
  { value : 'Bachelors Degree' , label : 'Bachelor\'s Degree' },
  { value : 'Masters Degree', label : 'Master\'s Degree'},
  { value : 'Doctorate', label : 'Doctorate'}
];

export const validateTimeZone = (value) => {
  if (!value) return 'Time Zone is required';
  if (!timeZones.some(tz => tz.value === value)) return 'Invalid time zone selected';
  return true;
};
