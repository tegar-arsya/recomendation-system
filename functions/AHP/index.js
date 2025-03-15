import normalization from './normalization.js';
import globalCalculation from './globalCalculation.js';

export default function AHP (school) {
    const normalizedData = normalization(school);

    const globalData = globalCalculation(normalizedData.normalizedValues);

    const ranking = globalData.sort((a, b) => b.total_calculation - a.total_calculation);
    
    return ranking;
};