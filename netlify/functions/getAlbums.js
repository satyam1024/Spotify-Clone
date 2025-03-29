const fs = require("fs");
const path = require("path");

exports.handler = async () => {
    const songsDir = path.join(__dirname, "../../songs");

    try {
        // Get all folders inside /songs
        const folders = fs.readdirSync(songsDir).filter(file => fs.lstatSync(path.join(songsDir, file)).isDirectory());

        return {
            statusCode: 200,
            body: JSON.stringify(folders),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Could not read albums", details: error.message }),
        };
    }
};
