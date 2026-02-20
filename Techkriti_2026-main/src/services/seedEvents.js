import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

const seedEvents = async () => {
    const events = [
        { id: 'product_challenge', name: 'Product Challenge', category: 'Business' },
        { id: 'pitch_premiere', name: 'Pitch Premiere', category: 'Business' },
        { id: 'iarc', name: 'IARC', category: 'Robogames' },
        { id: 'robowars', name: 'Robowars', category: 'Robogames' },
        { id: 'code_&_compete', name: 'Code & Compete', category: 'Software' }
    ];

    for (const event of events) {
        await setDoc(doc(db, "events", event.id), {
            name: event.name,
            category: event.category,
            type: 'team' // assuming team for now
        });
    }
    console.log("Events seeded successfully!");
};

// You can call this from a button or just once
export default seedEvents;
