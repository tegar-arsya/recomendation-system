import schoolData from '../../database/school.json' assert { type: 'json' };

import normalization from './normalization.js';
import globalCalculation from './globalCalculation.js';

export default function AHP () {
    const normalizedData = normalization(schoolData.school);
    const globalData = globalCalculation(normalizedData.normalizedValues);

    const ranking = globalData.sort((a, b) => b.total_calculation - a.total_calculation);
    
    return ranking;
};