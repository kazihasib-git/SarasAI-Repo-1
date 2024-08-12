function timezoneIdToName(id, timezones) {
    // Find the timezone object with the matching id
    const timezone = timezones.find(tz => tz.id === id);

    // Return the time_zone if found, otherwise return null
    return timezone ? timezone.time_zone : null;
}

export { timezoneIdToName };
