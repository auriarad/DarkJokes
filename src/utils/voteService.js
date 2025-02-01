import { v4 as uuidv4 } from 'uuid';

export const getClientId = () => {
    let clientId = localStorage.getItem('clientId');
    if (!clientId) {
        clientId = uuidv4() + '-' + Date.now().toString(36);
        localStorage.setItem('clientId', clientId);
    }
    return clientId;
};

export const handleVote = async (jokeId, voteType) => {
    try {
        const res = await fetch(`/api/jokes/${jokeId}/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                voteType,
                clientId: getClientId()
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Voting failed');
        }

        return data;
    } catch (error) {
        console.error('Voting failed:', error);
        throw error;
    }
};
