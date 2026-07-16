const test = async () => {
    try {
        console.log('--- REGISTER ---');
        const regRes = await fetch('http://localhost:5001/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'testuser_' + Date.now(), email: `test_${Date.now()}@example.com`, password: 'password123' })
        });
        const regText = await regRes.text();
        console.log("Response Status:", regRes.status);
        console.log("Response Body:", regText);

        try {
            const regData = JSON.parse(regText);
            const token = regData.token;
            if (!token) {
                console.log('No token received from register.');
                return;
            }

            console.log('\n--- GET ME ---');
            const meRes = await fetch('http://localhost:5001/api/auth/me', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const meText = await meRes.text();
            console.log("ME Response Status:", meRes.status);
            console.log("ME Response Body:", meText);
        } catch (e) {
            console.log("Failed to parse JSON");
        }
    } catch (e) {
        console.error('Error during test:', e);
    }
};

test();
