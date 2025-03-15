import express, { response } from 'express';

import { getFirestore, collection, getDoc, doc, getDocs, query, where, limit } from 'firebase/firestore';
import { body, validationResult } from 'express-validator';
  
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
        return res.status(400).send(result)
    }

    // firebase
    const schools = [];
    const direction = [];

    let docs = await getDocs(
                        query(
                            collection(db, "schools"), 
                                body.type ? where('type', '==', body.type) : '',

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
    const userAddress = body.address;
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
            distance_value,
            accreditation_value,
            facility_value,
        }
    })
    return res.send({
        result
    })
})

export default router;