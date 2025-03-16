import express from 'express';
import AHP from '../functions/AHP/index.js'
import electre from '../functions/electre/index.js';
import saw from '../functions/SAW/index.js';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Ambil direktori saat ini dengan aman di ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path absolut ke `ahp.json`
const ahpFilePath = path.resolve(__dirname, '../../database/ahp.json');

async function loadJSON(filePath) {
  const data = await readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

const ahp = await loadJSON(ahpFilePath);

const router = express.Router();

router.get('/', (req, res) => {
    const ahpResult = AHP(schoolData.school);
    const electreResult = electre(ahpResult);
    const sawResult = saw(ahpResult);

    const rankingByAhp = ahpResult.sort((a, b) => b.global_score - a.global_score);
    const rankingBySaw = sawResult.result.sort((a, b) => b.value - a.value);

    const rankingAhp = rankingByAhp.map((item) => {
        return {
            id: item.id,
            name: item.name
        }
    })

    const rankingSaw = rankingBySaw.map((item) => {
        return {
            id: item.id,
            name: item.name
        }
    })
    
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
