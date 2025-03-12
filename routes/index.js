/**
 * @swagger
 * /listSchool:
 *   get:
 *     summary: Retursn list oh schools
 *     responses:
 *       200:
 *         description: A successful response
 */
import express from 'express';
import AHP from '../functions/AHP/index.js'
import electre from '../functions/Electre/index.js';
import saw from '../functions/SAW/index.js';
import { getFirestore, collection, getDoc, doc, getDocs, query, where, limit } from 'firebase/firestore';

const router = express.Router();

// Definisikan rute di sini
router.get('/', (req, res) => {
    const ahpResult = AHP();
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

router.get('/listSchool', async (req, res) => {
    try {
        const db = getFirestore();
        const colRef = collection(db, 'books');

        const data = await getDocs(colRef).then((snapshot) => {
            return snapshot.docs.map(doc => doc.data());
        });

        res.send({
            data
        })
    } catch (error) {
        res.status(500
            ).json({ error: error.message });
    }
})

// Ekspor router sebagai default
export default router;
