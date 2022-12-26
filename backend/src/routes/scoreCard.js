import { Router } from "express";
import ScoreCard from "../models/ScoreCard";

const router = Router();
router.delete("/cards", async (req, res) => {
    try {
        await ScoreCard.deleteMany({});
        // console.clear();
        res.json({message: "Database cleared"});
    } catch (e) { res.status(406).send({message: "Database deletion failed: " + e}); }
});
router.post("/card", async (req, res) => {
    const { name, subject, score } = req.body;
    const existing = await ScoreCard.findOne({name, subject});
    if (existing) { // update the score
        try { 
            await ScoreCard.replaceOne({name, subject}, {name, subject, score});
            res.json({
                card: existing,
                message: `Updating (${name}, ${subject}, ${score})`
            });
        } catch(e) { res.status(406).send({message: ("Scorecard update error: "+ e)}); }
    } else {  // create new card
        try {
            const newScoreCard = new ScoreCard({name, subject, score});
            const card = newScoreCard.save();
            res.json({
                card, 
                message: `Adding (${name}, ${subject}, ${score})`
            });
        } catch(e) { res.status(406).send({message: ("Scorecard creation error: "+ e)}); }
    }
});
router.get("/cards", async (req, res) => {
    const { type, queryString } = req.query;
    // maybe try-catch is not needed?
    let filter = new Object();
    filter[type] = queryString;
    const results = await ScoreCard.find(filter);
    if (results.length) {
        res.json({ messages: results.map((result) => `Found card with ${type}: (${result.name}, ${result.subject}, ${result.score})`) });
    } else {
        res.json({ message: `${type[0].toUpperCase()+type.slice(1)} (${queryString}) not found!` });
    }
    // res.json({ messages , message });
});
export default router;
 