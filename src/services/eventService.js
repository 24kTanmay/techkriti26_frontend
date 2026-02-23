import { db } from '../firebase';
import {
    collection,
    doc,
    setDoc,
    addDoc,
    getDoc,
    getDocs,
    query,
    where,
    updateDoc,
    arrayUnion,
    arrayRemove,
    serverTimestamp,
    deleteDoc
} from 'firebase/firestore';

// Events
export const getEvents = async () => {
    const querySnapshot = await getDocs(collection(db, "events"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Registrations
export const registerAsIndividual = async (userId, eventId) => {
    const regId = `${userId}_${eventId}`;
    await setDoc(doc(db, "registrations", regId), {
        userId,
        eventId,
        type: 'individual',
        status: 'active',
        registeredAt: serverTimestamp()
    });
};

// Teams
export const createTeam = async (leaderId, eventId, eventName, teamName) => {
    // 1. Generate Custom Team ID: first word of eventName in lowercase + random number
    const firstWord = eventName.split(' ')[0].toLowerCase();
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4 digit random number
    const customTeamId = `${firstWord}${randomNumber}`;

    // 2. Create Team Document with custom ID
    const teamRef = doc(db, "teams", customTeamId);

    // Check if ID exists (rare collision)
    const existingDoc = await getDoc(teamRef);
    if (existingDoc.exists()) {
        // Simple retry logic if collision occurs
        return createTeam(leaderId, eventId, eventName, teamName);
    }

    await setDoc(teamRef, {
        name: teamName,
        eventId,
        eventName,
        leaderId,
        members: [leaderId],
        createdAt: serverTimestamp()
    });

    // 3. Create Registration for Leader
    const regId = `${leaderId}_${eventId}`;
    await setDoc(doc(db, "registrations", regId), {
        userId: leaderId,
        eventId,
        eventName,
        teamId: customTeamId,
        role: 'leader',
        status: 'active',
        registeredAt: serverTimestamp()
    });

    return customTeamId;
};

export const requestToJoinTeam = async (userId, eventId, teamId) => {
    // 1. Verify Team exists and eventId matches
    const teamDoc = await getDoc(doc(db, "teams", teamId));

    if (!teamDoc.exists()) {
        throw new Error("Invalid Team ID. Please check and try again.");
    }

    const teamData = teamDoc.data();
    if (teamData.eventId !== eventId) {
        throw new Error(`This Team ID belongs to ${teamData.eventName}, not the current event.`);
    }

    // 2. Create Request
    await addDoc(collection(db, "teamRequests"), {
        userId,
        eventId,
        eventName: teamData.eventName,
        teamId,
        status: 'pending',
        requestedAt: serverTimestamp()
    });
};


export const getPendingRequestsForLeader = async (leaderId) => {
    // First get all teams where user is leader
    const teamsQuery = query(collection(db, "teams"), where("leaderId", "==", leaderId));
    const teamsSnapshot = await getDocs(teamsQuery);
    const teamIds = teamsSnapshot.docs.map(doc => doc.id);

    if (teamIds.length === 0) return [];

    // Then get pending requests for those teams
    const requestsQuery = query(
        collection(db, "teamRequests"),
        where("teamId", "in", teamIds),
        where("status", "==", "pending")
    );
    const requestsSnapshot = await getDocs(requestsQuery);

    // Enrich with user data
    const enrichedRequests = [];
    for (const requestDoc of requestsSnapshot.docs) {
        const data = requestDoc.data();
        const userDoc = await getDoc(doc(db, "users", data.userId));
        enrichedRequests.push({
            id: requestDoc.id,
            ...data,
            user: userDoc.exists() ? userDoc.data() : null
        });
    }
    return enrichedRequests;

};

export const handleTeamRequest = async (requestId, status) => {
    try {
        const requestDoc = await getDoc(doc(db, "teamRequests", requestId));
        if (!requestDoc.exists()) {
            throw new Error("Request document not found");
        }

        const { userId, eventId, teamId } = requestDoc.data();
        let { eventName } = requestDoc.data();

        // Fallback for eventName if it's missing (legacy requests)
        if (!eventName) {
            const teamDoc = await getDoc(doc(db, "teams", teamId));
            eventName = teamDoc.exists() ? teamDoc.data().eventName : eventId;
        }

        if (status === 'accepted') {
            // 1. Add member to team
            const teamRef = doc(db, "teams", teamId);
            await updateDoc(teamRef, {
                members: arrayUnion(userId)
            });

            // 2. Create/Update registration for member
            const regId = `${userId}_${eventId}`;
            await setDoc(doc(db, "registrations", regId), {
                userId,
                eventId,
                eventName: eventName || eventId,
                teamId,
                role: 'member',
                status: 'active',
                registeredAt: serverTimestamp()
            });
        }

        // 3. Update request status
        await updateDoc(doc(db, "teamRequests", requestId), {
            status,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error in handleTeamRequest:", error);
        throw error; // Re-throw to be caught by UI
    }
};


export const getUserRegistrations = async (userId) => {
    const q = query(collection(db, "registrations"), where("userId", "==", userId), where("status", "==", "active"));
    const querySnapshot = await getDocs(q);

    const registrations = [];
    for (const registrationDoc of querySnapshot.docs) {
        const regData = registrationDoc.data();
        // Fetch event details
        const eventDoc = await getDoc(doc(db, "events", regData.eventId));

        // Fetch team details if exists
        let teamData = null;
        if (regData.teamId) {
            const teamDoc = await getDoc(doc(db, "teams", regData.teamId));
            if (teamDoc.exists()) {
                teamData = teamDoc.data();
                // Fetch member details (names)
                const memberDetails = [];
                for (const memberId of teamData.members) {
                    const memberDoc = await getDoc(doc(db, "users", memberId));
                    memberDetails.push({
                        uid: memberId,
                        fullName: memberDoc.exists() ? memberDoc.data().fullName : 'Unknown User'
                    });
                }
                teamData.memberDetails = memberDetails;
            }
        }

        registrations.push({
            id: registrationDoc.id,
            ...regData,
            event: eventDoc.exists() ? { id: eventDoc.id, ...eventDoc.data() } : null,
            team: teamData
        });
    }
    return registrations;
};

export const getSentRequests = async (userId) => {
    const q = query(
        collection(db, "teamRequests"),
        where("userId", "==", userId),
        where("status", "==", "pending")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


export const withdrawFromEvent = async (userId, eventId) => {
    const regId = `${userId}_${eventId}`;
    const regRef = doc(db, "registrations", regId);
    const regDoc = await getDoc(regRef);

    if (!regDoc.exists()) return;

    const { teamId, role } = regDoc.data();

    // 1. Update registration status
    await updateDoc(regRef, {
        status: 'withdrawn'
    });

    // 2. If in a team, remove from team members
    if (teamId) {
        if (role === 'leader') {
            // If leader withdraws, what happens? Usually team might be disbanded or transferred.
            // For now, let's just mark the team as inactive or handle it simply.
            // Requirements don't specify leader's team-wide withdrawal.
            await updateDoc(doc(db, "teams", teamId), {
                status: 'withdrawn' // Optional: mark team as withdrawn
            });
        } else {
            await updateDoc(doc(db, "teams", teamId), {
                members: arrayRemove(userId)
            });
        }
    }

    // 3. Update pending teamRequests to withdrawn
    const q = query(
        collection(db, "teamRequests"),
        where("userId", "==", userId),
        where("eventId", "==", eventId),
        where("status", "==", "pending")
    );
    const querySnapshot = await getDocs(q);
    for (const requestDoc of querySnapshot.docs) {
        await updateDoc(doc(db, "teamRequests", requestDoc.id), {
            status: 'withdrawn'
        });
    }
};
