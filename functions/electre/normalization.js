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

export default function normalization(data) {
    let globalNormalization = 0;

    // normalization score global (all value)
    if (data.length > 0) { 
        let length = data.length - 1; 
        data.forEach((v, i) => { 
            globalNormalization += Math.pow(v.global_score, 2);

            if (i === length) {
                globalNormalization = Math.sqrt(globalNormalization);
            }
        });
    } else {
        console.error("Array data kosong, tidak ada elemen untuk diproses.");
    }

    // normalization score global (single value)
    const singleNormalization = data.map(item => {
            return {
                name: item.name,
                globalNormalization: item.global_score / globalNormalization
            }
    });

    // weight normalization
    const Wnormalization = singleNormalization.map(item => {
        return {
            name: item.name,
            value: item.globalNormalization * ahp.criteria.akreditas
        }
    });

    return Wnormalization;
}