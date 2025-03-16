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