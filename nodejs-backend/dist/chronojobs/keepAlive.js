import axios from "axios";
// Function to keep the Render app alive
export const keepAlive = () => {
    setInterval(() => {
        axios.get("https://your-app.onrender.com")
            .then(response => console.log("Pinged:", response.status))
            .catch(error => console.error("Ping failed:", error.message));
    }, 600000); // Ping every 10 minutes
};
