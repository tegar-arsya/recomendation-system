import express from 'express';
import AHP from '../functions/AHP/index.js';
import electre from '../functions/electre/index.js';
import saw from '../functions/SAW/index.js';
import utils from '../config/utils.js';

const { loadJSON } = utils();

const router = express.Router();

// Load JSON data
let schoolData;
(async () => {
    schoolData = await loadJSON('../database/school.json');
})();

router.get('/', (req, res) => {
    if (!schoolData) {
        return res.status(500).json({ error: 'Data sekolah tidak ditemukan.' });
    }

    const ahpResult = AHP(schoolData.school);
    const electreResult = electre(ahpResult);
    const sawResult = saw(ahpResult);

    const rankingByAhp = ahpResult.sort((a, b) => b.global_score - a.global_score);
    const rankingBySaw = sawResult.result.sort((a, b) => b.value - a.value);

    const rankingAhp = rankingByAhp.map((item) => {
        return {
            id: item.id,
            name: item.name
        };
    });

    const rankingSaw = rankingBySaw.map((item) => {
        return {
            id: item.id,
            name: item.name
        };
    });
    
    const isRankingEqual = (arr1, arr2) => {
        return arr1.length === arr2.length && arr1.every((item1) =>
            arr2.some((item2) => item1 === item2)
        );
    };

    res.json({
        ahp: ahpResult,
        electre: electreResult,
        saw: sawResult,
        ranking: isRankingEqual ? rankingAhp : rankingSaw
    });
});

// Ekspor router sebagai default
export default router;