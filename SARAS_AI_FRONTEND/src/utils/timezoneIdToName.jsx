function timezoneIdToName(Id, timezones) {
    const timezone = timezones.find(tz => tz.id === Id);
    return timezone ? timezone.time_zone : null;
}

function timezoneIdToUTCOffset(Id, timezones) {
    const timezone = timezones.find(tz => tz.id === Id);
    return timezone ? timezone.utc_offset : null;
}

function fetchtimezoneDetails(Id, timezones) {
    return timezones.find(tz => tz.id === Number(Id));
}

export { timezoneIdToName, timezoneIdToUTCOffset, fetchtimezoneDetails };
