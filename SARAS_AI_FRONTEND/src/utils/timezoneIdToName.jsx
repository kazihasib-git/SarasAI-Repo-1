function timezoneIdToName(Id, timezones) {
    const timezone = timezones.find((tz) => tz.id === Id);
    return timezone ? timezone.time_zone : null;
}

export { timezoneIdToName };
