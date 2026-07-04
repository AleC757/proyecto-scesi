require('dotenv').config();

module.exports= {
        groqApiKey: process.env.GROQ_API_KEY,
        port: process.env.PORT||3000,
};