import utils from '../../config/utils.js';
const { loadJSON } = utils();

const ahp = await loadJSON();

if (!ahp) {
    throw new Error('Data AHP tidak ditemukan.');
}

export default function normalization(data){
    const highestGlobalScore = data.reduce((max, current) => {
        return (current.global_score > max.global_score) ? current : max;
    }).global_score;

    const normalization = data.map(item => {
        return {
            id: item.id,
            name: item.name,
            value: item.global_score / highestGlobalScore
        }
    });

    const Wmatrix = normalization.map(item => {
        return {
            ...item,
            value: item.value * ahp.criteria.akreditas
        }
    });

    return Wmatrix;
}