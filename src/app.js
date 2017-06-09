import express from 'express';
import fetch from 'node-fetch';
import db from 'sqlite';
import fs from 'mz/fs';
import jsesc from 'jsesc';

const app = express();

// Updates the database
const updateDatabase = async () => {
    console.log()
    const data = await (await fetch('https://shadowverse-portal.com/api/v1/cards?format=json&lang=en')).json();
    for (let card of data.data.cards) {
        try {
            await db.run(`INSERT INTO cards VALUES (
            ${card.card_id},
            ${card.foil_card_id},
            ${card.card_set_id},
            "${jsesc(card.card_name.replace(/"/g, "'"))}",
            ${card.is_foil},
            ${card.char_type},
            ${card.clan},
            "${jsesc(card.tribe_name.replace(/"/g, "'"))}",
            "${jsesc(card.skill_disc.replace(/"/g, "'"))}",
            "${jsesc(card.evo_skill_disc.replace(/"/g, "'"))}",
            ${card.cost},
            ${card.atk},
            ${card.life},
            ${card.evo_atk},
            ${card.evo_life},
            ${card.rarity},
            ${card.get_red_ether},
            ${card.use_red_ether},
            "${jsesc(card.description.replace(/"/g, "'"))}",
            "${jsesc(card.evo_description.replace(/"/g, "'"))}",
            "${jsesc(card.cv.replace(/"/g, "'"))}",
            ${card.base_card_id},
            ${card.tokens},
            ${card.normal_card_id})`);
        }
        catch (err) {
            if (!err.errno === 19)
                console.error(err);
        }
    }
}

app.get('/cards', async (req, res) => {
    res.send(await db.all("SELECT * FROM cards"));
});

app.get('/cards/:id', async (req, res) => {
    res.send(await db.all(`SELECT * FROM cards WHERE card_name = '${req.params.id}'`));
});

app.listen(3000, async () => {

    // Connects to the database and creates the appropriate tables
    try {
        await db.open('./db.sqlite');
        await db.run(await fs.readFile('./queries/createTable.sql', "utf8"))

        // Updates the database once at launch, and once every 48 hours
        await updateDatabase();
        setInterval(async () => { await updateDatabase() }, 172800000);
    }
    catch (err) {
        if (!err.errno === 1)
            console.error(err);
    }

    console.log("Listening on port 3000.");
});