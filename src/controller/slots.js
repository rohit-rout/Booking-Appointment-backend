import db from "../service/firestore.js";



export const getSlots = async (req, res) => {

    try {
        const snapshot = await db.readCollectionData('booking-appointments');
        snapshot.forEach((doc) => {
            console.log(doc.data());
        })
    } catch (error) {
        console.log(error);
    }
    res.send('Here you will get free slots!')
}