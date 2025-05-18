import db from "../service/firestore.js";
import config from 'config';
import { formatDateToTimezone, getAvailableSlots, getStartEndTimestamps } from "../utils/helper.js";
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
            { field: 'appointment', operator: '<=', value: endTimestamp }
        ];

        const path = [
            { name: collection, type: 'col' },
            { name: 'john', type: 'doc' },
            { name: 'appointments', type: 'col' }
        ];
        const data = await db.readCollectionData(path, filters);
        if (data.empty) return res.status(404).send('No slots found');

        let appointments = [];
        data.forEach((doc) => {
            const slot = doc.data();
            const time = formatDateToTimezone(slot.appointment._seconds, timezone);
            console.log(time);
            appointments.push(slot.appointment._seconds);

        })

        const availableSlots = getAvailableSlots(date, timezone, appointments);
        res.status(200).send({ success: true, slot: availableSlots })
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error: error.message })
    }

}