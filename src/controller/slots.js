import db from "../service/firestore.js";
import config from 'config';
import { convertDateStringToTimeStamp, formatDateToTimezone, getAvailableSlots, getDateTimeStamp, getStartEndTimestamps } from "../utils/helper.js";
const collection = config.get('db.collection');




export const getSlots = async (req, res) => {
    try {
        const { date, timezone } = req.query;
        if (!date || !timezone) {
            res.status(400).send('Please provide date and timezone');
        }

        const { startTimestamp, endTimestamp } = getStartEndTimestamps(date, timezone);

        const filters = [
            { field: 'appointment', operator: '>=', value: startTimestamp },
            { field: 'appointment', operator: '<', value: endTimestamp }
        ];

        const path = [
            { name: collection, type: 'col' },
            { name: 'john', type: 'doc' },
            { name: 'appointments', type: 'col' }
        ];
        const data = await db.readCollectionData(path, filters);

        let appointments = [];
        data.forEach((doc) => {
            const slot = doc.data();
            appointments.push(slot.appointment._seconds);

        })

        const availableSlots = getAvailableSlots(date, timezone, appointments);
        res.status(200).send({ success: true, slot: availableSlots })
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error: error.message })
    }

}


export const addSlot = async (req, res) => {
    try {
        const { date, time, timezone, email, firstName, phone } = req.body

        if (!date || !time || !timezone) {
            return res.status(400).send({ success: false, message: 'Missing required fields' });
        }

        const timestamp = convertDateStringToTimeStamp(date, time, timezone);

        const path = [
            { name: collection, type: 'col' },
            { name: 'john', type: 'doc' },
            { name: 'appointments', type: 'col' }
        ];

        const newAppointment = {
            appointment: timestamp,
            name: firstName,
            email: email,
            phone: phone
        };

        const ref = await db.addDocument(path, newAppointment);

        res.status(201).send({ success: true, id: ref.id, message: 'Appointment added successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: error.message });
    }
};


export const getSlotsByDate = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        console.log(startDate, endDate);
        if (!startDate || !endDate) {
            res.status(400).send('Please provide date and timezone');
        }

        const startDateTimeStamp = getDateTimeStamp(startDate, true);
        const endDateTimeStamp = getDateTimeStamp(endDate, false);

        console.log(startDateTimeStamp, endDateTimeStamp);

        const path = [
            { name: collection, type: 'col' },
            { name: 'john', type: 'doc' },
            { name: 'appointments', type: 'col' }
        ];

        const filters = [
            { field: 'appointment', operator: '>=', value: startDateTimeStamp },
            { field: 'appointment', operator: '<', value: endDateTimeStamp }
        ];

        const data = await db.readCollectionData(path, filters);
        let slots = [];
        data.forEach((doc) => {
            const slot = doc.data();
            slots.push(formatDateToTimezone(slot.appointment._seconds))

        })
        res.status(200).send({ success: true, slots: slots });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error: error.message })
    }
}
