const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
    const folder = event.queryStringParameters.folder || "";
    const songsDir = path.join(__dirname, "../../songs", folder);

    try {
        const files = fs.readdirSync(songsDir);
        const songs = files.filter(file => file.endsWith(".mp3"));
        
        return {
            statusCode: 200,
            body: JSON.stringify(songs),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Could not read directory" }),
        };
    }
};
