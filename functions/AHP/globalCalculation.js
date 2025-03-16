import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ahpFilePath = path.resolve(__dirname, '../../database/ahp.json');

async function loadJSON(filePath) {
    try {
        const data = await readFile(filePath, 'utf-8');
        console.log("✅ File loaded successfully:", filePath);
        const parsedData = JSON.parse(data);


        if (!parsedData || typeof parsedData !== 'object') {
            throw new Error('Data JSON tidak valid.');
        }
        return parsedData;
    } catch (error) {
        console.error(`❌ Error loading JSON file: ${filePath}`, error.message);
        return null;
    }
}




export default async function globalCalculation(normalization) {
    const ahp = await loadJSON(ahpFilePath);
    if (!ahp || !ahp.criteria) {
        console.error("❌ Error: Data kriteria AHP hilang atau tidak valid.");
        return [];
    }
    console.log("📊 Data AHP:", ahp);
    
    const ahpData = ahp.criteria;

    const result = normalization.map(item => {
        const akreditasi = item.akreditasiNormalized * ahpData.akreditas;
        const fasilitas = item.fasilitasNormalized * ahpData.fasilitas;
        const jarak = item.jarakNormalized * ahpData.jarak;

        return {
            ...item,
            global_score: akreditasi + fasilitas + jarak
        };        
    });

    return result;
}