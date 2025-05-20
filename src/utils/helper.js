import { Timestamp } from 'firebase-admin/firestore';
import { DateTime } from 'luxon';
import config from 'config';

const START_TIME = config.get('client.START_TIME');
const END_TIME = config.get('client.END_TIME');
const SLOT_DURATION_MINUTES = config.get('client.SLOT_DURATION_MINUTES');
const TIMEZONE = config.get('client.TIME_ZONE');


export const formatDateToTimezone = (seconds, timezone) => {
    const jsDate = new Date(seconds * 1000).toISOString();
    return DateTime.fromISO(jsDate, { zone: timezone }).toFormat('yyyy-MM-dd HH:mm');

}

export const convertDateStringToTimeStamp = (dateString, time, timezone) => {
    const dt = DateTime.fromFormat(`${dateString} ${time}`, 'yyyy-MM-dd h:mm a', { zone: timezone });
    if (!dt.isValid) return new Error('Invalid date');
    return Timestamp.fromDate(dt.toJSDate());
}

export const getStartEndTimestamps = (dateString, timezone) => {
    const start = DateTime.fromISO(dateString, { zone: timezone }).startOf('day')
    const end = start.plus({ days: 1 });

    return {
        startTimestamp: Timestamp.fromDate(start.toJSDate()),
        endTimestamp: Timestamp.fromDate(end.toJSDate()),
    };
};


export const getDateTimeStamp = (dateString, start) => {
    let dt = DateTime.fromISO(dateString).startOf('day');
    if (!start) dt = dt.plus({ days: 1 })
    return Timestamp.fromDate(dt.toJSDate());
}

export const generateSlots = (dateString, timezone, slotDurationMinutes) => {

    const previousDayStart = DateTime.fromISO(dateString, { zone: TIMEZONE }).minus({ days: 1 }).set({ hour: START_TIME, minute: 0 }).setZone(timezone);
    const previousDayEnd = DateTime.fromISO(dateString, { zone: TIMEZONE }).minus({ days: 1 }).set({ hour: END_TIME, minute: 0 }).setZone(timezone);
    const currentDayStart = DateTime.fromISO(dateString, { zone: TIMEZONE }).set({ hour: START_TIME, minute: 0 }).setZone(timezone);
    const currentDayEnd = DateTime.fromISO(dateString, { zone: TIMEZONE }).set({ hour: END_TIME, minute: 0 }).setZone(timezone);

    const allSlots = [];
    let current = previousDayStart;

    while (current < previousDayEnd) {
        const slotStart = current;
        const slotEnd = current.plus({ minutes: slotDurationMinutes });
        if (slotStart.toISODate() === dateString) {
            allSlots.push({ start: slotStart, end: slotEnd });
        }
        current = slotEnd;
    }
    current = currentDayStart;

    while (current < currentDayEnd) {
        const slotStart = current;
        const slotEnd = current.plus({ minutes: slotDurationMinutes });
        if (slotStart.toISODate() === dateString) {
            allSlots.push({ start: slotStart, end: slotEnd });
        }
        current = slotEnd;
    }

    return allSlots;
}
export const getAvailableSlots = (dateString, timezone, appointments) => {
    const allSlots = generateSlots(dateString, timezone, SLOT_DURATION_MINUTES);

    const appointmentWindows = appointments.map(ts => {
        const start = DateTime.fromISO(new Date(ts * 1000).toISOString(), { zone: timezone });
        const end = start.plus({ minutes: SLOT_DURATION_MINUTES });
        return { start, end };
    });

    const availableSlots = allSlots.filter(slot => {
        return !appointmentWindows.some(appointment => {
            return (
                appointment.start < slot.end && appointment.end > slot.start
            );
        });
    });

    return availableSlots.map(slot => `${slot.start.toFormat('hh:mm a')}`);
};
