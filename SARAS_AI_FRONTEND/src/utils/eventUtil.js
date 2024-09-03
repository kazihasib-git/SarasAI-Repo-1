export const createEvent = (event, start, end) => ({
    id: event.id,
    admin_user_id: event.admin_user_id,
    meetingName: event.meeting_name,
    meetingId: event.meeting_id,
    platformId: event.platform_id,
    start: start,
    end: end,
    platform_tools: event.platform_tool_details,
    platform_meet: event.platform_meeting_details,
});