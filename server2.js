const express = require('express');
const https = require("https");
const agent = new https.Agent({ rejectUnauthorized: false });
const axios = require('axios').create({ httpsAgent: agent });
//const axios = require('axios');
const crypto = require('crypto');
const app = express();
app.use(express.json());

// ENV configuration
const KASM_URL = process.env.KASM_URL; // e.g. https://your.kasm.server
const API_KEY = process.env.KASM_API_KEY;
const API_KEY_SECRET = process.env.KASM_API_SECRET;
const KASM_CASTING_KEY = process.env.KASM_CASTING_KEY;

// Helper for Kasm API POST requests
// async function kasmApi(path, payload) {
//   return axios.post(`${KASM_URL}/api/public/${path}`, payload);
// }

// async function kasmApi(path, payload) {
//     try {
//         const url = `${KASM_URL}/api/public/${path}`;
//         console.log('POSTing to:', url, 'with payload:', payload);
//         return await axios.post(url, payload);
//     } catch (e) {
//         console.error('Kasm API error:', e.response?.status, e.response?.data || e.message);
//         throw e;
//     }
// }

async function kasmApi(path, payload) {
    try {
        const url = `${KASM_URL}/api/public/${path}`;
        console.log('POSTing to:', url, 'with payload:', payload);
        return await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (e) {
        console.error('Kasm API error:', e.response?.status, e.response?.data || e.message);
        throw e;
    }
}



// Generate secure password
function genPassword() {
    return crypto.randomBytes(12).toString('base64');
}


app.post('/api/launch', async (req, res) => {
    try {
        const { userId, appId } = req.body;
        let user;

        try {
            const userRes = await kasmApi('get_user', {
                api_key: API_KEY,
                api_key_secret: API_KEY_SECRET,
                target_user: { username: userId }
            });
            user = userRes.data.user;
        }
        catch (e) {
            const status = e.response?.status;
            const data = e.response?.data;
            const msg = typeof data === 'string' ? data : data?.error_message;

            console.error("DEBUG error", status, msg, data);

            if (status === 400) {
                console.log("User not found, creating...");
                const pw = genPassword();
                const createRes = await kasmApi("create_user", {
                    api_key: API_KEY,
                    api_key_secret: API_KEY_SECRET,
                    target_user: {
                        username: userId,
                        first_name: userId,
                        last_name: "user",
                        password: pw,
                        locked: false,
                        disabled: false,
                    },
                });
                user = createRes.data.user;
            } else {
                throw e;
            }
        }
        const getImages = await kasmApi('get_images', {
            api_key: API_KEY,
            api_key_secret: API_KEY_SECRET,
        })
        console.log(getImages.data);
        const kasmRes = await kasmApi('request_kasm', {
            api_key: API_KEY,
            api_key_secret: API_KEY_SECRET,
            user_id: user.user_id,
            image_id: getImages.data.images[0].image_id,
            enable_sharing: true,
            profile_mode: "enabled"
        });
        console.log(kasmRes.data);
        // const session_id = kasmRes.data.kasm_id;
        
        // 3. Get a temporary token for the specific session
        // const tokenRes = await kasmApi('create_session_token', {
        //     api_key: API_KEY,
        //     api_key_secret: API_KEY_SECRET,
        //     kasm_id: session_id
        // });
        
        // const sessionToken = tokenRes.data.token;
        
        // 4. Construct the casting URL
        const castingUrl = `${KASM_URL}/#cast/${KASM_CASTING_KEY}`;

        console.log('Persistent session URL:', castingUrl);

        res.json({
            user,
            session: kasmRes.data.session,
            casting_url: castingUrl
        });

        // res.json({ user, session: kasmRes.data });
    } catch (err) {
        res.status(500).json({ error: err.response?.data?.error_message || err.message });
    }
});


// Main entry point
// app.post('/api/launch', async (req, res) => {
//     try {
//         const { userId, appId } = req.body;
//         let user;
//         console.log(userId, appId);
//         try {
//             // Try get_user first
//             const userRes = await kasmApi('get_user', {
//                 api_key: API_KEY,
//                 api_key_secret: API_KEY_SECRET,
//                 target_user: { username: userId }
//             });

//             user = userRes.data.user;
//         } catch (e) {
//             // If get_user failed due to user not found (400)
//             if (e.response && e.response.status === 400 && e.response.data.error_message.includes("Unable to locate target_user")) {
//                 // Create user
//                 const pw = genPassword();
//                 const createRes = await kasmApi('create_user', {
//                     api_key: API_KEY,
//                     api_key_secret: API_KEY_SECRET,
//                     target_user: {
//                         username: userId,
//                         first_name: userId,
//                         last_name: "user",
//                         password: pw,
//                         locked: false,
//                         disabled: false
//                     }
//                 });
//                 console.log('Created user', createRes);
//                 user = createRes.data.user;
//                 console.log('Created user', user);
//             } else {
//                 // Re-throw any other errors
//                 throw e;
//             }
//         }
//         // 3. Launch app (workspace)
//         let kasmRes = await kasmApi('request_kasm', {
//             api_key: API_KEY,
//             api_key_secret: API_KEY_SECRET,
//             user_id: user.user_id,
//             image_id: appId, // appId is the workspace/image id
//             enable_sharing: false
//         });
//         // Poll for status until running
//         let status;
//         let tries = 12;
//         do {
//             await new Promise(r => setTimeout(r, 2500));
//             let statusRes = await kasmApi('get_kasm_status', {
//                 api_key: API_KEY,
//                 api_key_secret: API_KEY_SECRET,
//                 user_id: user.user_id,
//                 kasm_id: kasmRes.data.kasm_id
//             });
//             status = statusRes.data.operational_status || statusRes.data.kasm?.operational_status;
//             if (status === "running") {
//                 // Success!
//                 return res.json({
//                     kasm_url: statusRes.data.kasm_url,
//                     session_token: statusRes.data.kasm?.token || statusRes.data.session_token,
//                     user: userRes.data.user || createRes.data.user
//                 });
//             }
//         } while (tries--);
//         res.status(500).json({ error: "Kasm session did not start in time", status });
//     } catch (e) {
//         res.status(500).json({ error: e.response?.data?.error_message || e.message });
//     }
// });

//module.exports = app;


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
