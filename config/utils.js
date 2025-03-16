import { readFile } from 'fs/promises';

export default function utils() {
    const loadJSON = async () => {
        try {
            // Gunakan path absolut
            const jsonFilePath = '/var/task/database/ahp.json';

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