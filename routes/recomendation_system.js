import express from 'express';

import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { body, validationResult } from 'express-validator';
import AHP from '../functions/AHP/index.js';
import electre from '../functions/electre/index.js';
import saw from '../functions/SAW/index.js';
  
const router = express.Router();

const schema = [
    body('address')
        .notEmpty().withMessage("address is required!")
]

router.post('/', schema, async(req, res) => {
    const db = getFirestore();
    const validation = validationResult(req);
    const { body } = req

    // validation
    if(validation.errors.length  > 0) {
        return res.status(400).send(validation)
    }

    // firebase
    const { address: userAddress, type: userType } = body;

    const schools = [];
    const direction = [];

    let docs = await getDocs(
                            query(
                                collection(db, "schools"), 
                                userType ? where('type', '==', userType) : '',
                                )
                        )

    docs.forEach((doc) => {
            schools.push(doc.data())
    })

    docs = await getDocs(collection(db, "direction"))
    docs.forEach((doc) => {
            direction.push(doc.data())
    })

    // main function
    
    const result = schools.map((school) => {
            let distance_value = 1
            let accreditation_value = 1
            let facility_value = 1
    
            const distance = direction.find((v) => v.school_id === school.id)
    
            if(distance) {
                if (distance.priority_1.address_id === userAddress) {
                    distance_value = distance.priority_1.value
                }
                if (distance_value === 1) {
                    if (distance.priority_2.address_id.find((v) => v === userAddress)) {
                        distance_value = distance.priority_2.value
                    }
                }
            }
    
            school.accreditation === 'A' ? accreditation_value = 3 : school.accreditation === 'B' ? accreditation_value = 2 : accreditation_value = 1
            school.facility === 'layak' ? facility_value = 3 : school.facility === 'setara' ? facility_value = 2 : facility_value = 1
    
            return {
                id: school.id,
                name: school.name,
                jarak: distance_value,
                akreditasi: accreditation_value,
                fasilitas: facility_value,
            }
    })

    // method
    const ahpResult = AHP(result);
    const electreResult = electre(ahpResult);
    const sawResult = saw(ahpResult);

    // ranking
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
})

export default router;