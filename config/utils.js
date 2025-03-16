import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

export default function utils() {
    const loadJSON = async (relativePath) => {
        try {
            // Dapatkan path absolut ke file JSON
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const jsonFilePath = path.resolve(__dirname, relativePath);

            // Baca file JSON
            const data = await readFile(jsonFilePath, 'utf-8');
            const parsedData = JSON.parse(data);

            if (!parsedData || typeof parsedData !== 'object') {
                throw new Error('Data JSON tidak valid.');
            }
            return parsedData;
        } catch (error) {
            console.error(`❌ Error loading JSON file: ${relativePath}`, error.message);
            return null;
        }
    };

    return { loadJSON };
}