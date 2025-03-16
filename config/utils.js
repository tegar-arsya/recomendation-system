import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

export default function utils() {
    const loadJSON = async () => {
        try {
            // Dapatkan path dari environment variable
            const relativePath = process.env.DATABASE_PATH || './database/ahp.json';
            if (!relativePath) {
                throw new Error('Environment variable DATABASE_PATH tidak ditemukan.');
            }

            // Dapatkan path absolut ke file JSON
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const jsonFilePath = path.resolve(__dirname, relativePath);

            // Debug path
            console.log('Mencoba membaca file JSON dari path:', jsonFilePath);

            // Baca file JSON
            const data = await readFile(jsonFilePath, 'utf-8');
            const parsedData = JSON.parse(data);

            if (!parsedData || typeof parsedData !== 'object') {
                throw new Error('Data JSON tidak valid.');
            }
            return parsedData;
        } catch (error) {
            console.error(`❌ Error loading JSON file:`, error.message);
            return null;
        }
    };

    return { loadJSON };
}