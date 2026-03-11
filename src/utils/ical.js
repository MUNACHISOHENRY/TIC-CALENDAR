export const generateICal = (event) => {
    const formatDate = (dateStr, timeStr) => {
        // Basic formatting for iCal locally: YYYYMMDDTHHMMSS
        const [y, m, d] = dateStr.split('-');
        let h = '00', min = '00';
        if (timeStr) {
            const parts = timeStr.split(':');
            h = parts[0];
            min = parts[1];
        }
        return `${y}${m}${d}T${h}${min}00`;
    };

    const start = formatDate(event.date, event.startTime);
    const end = event.endTime ? formatDate(event.date, event.endTime) : start;

    const icsStr = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//TIC Calendar//EN',
        'BEGIN:VEVENT',
        `UID:${event.id || Date.now()}@tic.calendar`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `SUMMARY:${event.title || 'Event'}`,
        `DESCRIPTION:${event.description || ''}`,
        `LOCATION:${event.location || ''}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsStr], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(event.title || 'event').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
