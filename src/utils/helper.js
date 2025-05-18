import { Timestamp } from 'firebase-admin/firestore';
import { DateTime } from 'luxon';
import config from 'config';
const startTime = config.get('client.START_TIME');
const endTime = config.get('client.END_TIME');
const slotDurationMinutes = config.get('client.SLOT_DURATION_MINUTES');


export const formatDateToTimezone = (ms, timezone) => {
    const jsDate = new Date(ms * 1000);
    return DateTime.fromJSDate(jsDate, { zone: timezone }).toFormat('yyyy-MM-dd HH:mm');

}


export const getStartEndTimestamps = (dateString, timezone) => {
    const start = DateTime.fromISO(dateString, { zone: timezone }).startOf('day').toUTC();
    const end = DateTime.fromISO(dateString, { zone: timezone }).endOf('day').toUTC();

    return {
        startTimestamp: Timestamp.fromDate(start.toJSDate()),
        endTimestamp: Timestamp.fromDate(end.toJSDate()),
    };
};

export const generateSlots = (dateString, timezone, slotDurationMinutes) => {

    const dayStart = DateTime.fromISO(dateString, { zone: timezone }).set({ hour: startTime, minute: 0 });
    const dayEnd = DateTime.fromISO(dateString, { zone: timezone }).set({ hour: endTime, minute: 0 });

    const allSlots = [];
    let current = dayStart;

    while (current < dayEnd) {
        const slotStart = current;
        const slotEnd = current.plus({ minutes: slotDurationMinutes });
        allSlots.push({ start: slotStart, end: slotEnd });
        current = slotEnd;
    }

    return allSlots;
}
export const getAvailableSlots = (dateString, timezone, appointments) => {
    const allSlots = generateSlots(dateString, timezone, slotDurationMinutes);

    const appointmentWindows = appointments.map(ts => {
        const start = DateTime.fromJSDate(new Date(ts * 1000), { zone: timezone });
        const end = start.plus({ minutes: slotDurationMinutes });
        return { start, end };
    });

    const availableSlots = allSlots.filter(slot => {
        return !appointmentWindows.some(appointment => {
            return (
                appointment.start < slot.end && appointment.end > slot.start
            );
        });
    });

    return availableSlots.map(slot => `${slot.start.toFormat('HH:mm')}`);
};
