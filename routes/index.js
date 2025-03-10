import express from 'express';
import AHP from '../functions/AHP/index.js'
import electre from '../functions/Electre/index.js';
import saw from '../functions/SAW/index.js';

const router = express.Router();

// Definisikan rute di sini
router.get('/', (req, res) => {
    const ahpResult = AHP();
    const electreResult = electre(ahpResult);
    const sawResult = saw(ahpResult);

    const rankingByAhp = ahpResult.sort((a, b) => b.global_score - a.global_score);


    const ranking = rankingByAhp.map((item) => {
        return {
            id: item.id,
            name: item.name
        }
    })
    res.json({
        ahp: ahpResult,
        electre: electreResult,
        saw: sawResult,
        ranking
    });
});

// Ekspor router sebagai default
export default router;
