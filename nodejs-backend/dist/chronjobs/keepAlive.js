import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();
const SERVER_IP = process.env.SERVER_IP;
// Function to keep the Render app alive
export const keepAlive = () => {
    setInterval(() => {
        if (!SERVER_IP)
            return;
        axios.get(SERVER_IP + "/health")
            .then(response => console.log("Pinged:", response.status))
            .catch(error => console.error("Ping failed:", error.message));
    }, 600000); // Ping every 10 minutes
};
