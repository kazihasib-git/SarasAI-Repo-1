function timezoneIdToName(Id, timezones) {
    const timezone = timezones.find(tz => tz.id === Id);
    return timezone ? timezone.time_zone : null;
}

function timezoneIdToUTCOffset(Id, timezones){
    const timezone = timezones.find(tz => tz.id === Id);
    return timezone ? timezone.utc_offset : null;
}

export { timezoneIdToName,  timezoneIdToUTCOffset};

