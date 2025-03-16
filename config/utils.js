import { readFile } from 'fs/promises';


export default function utils() {
    const loadJSON = async (filePath) => {
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
    };

    return { loadJSON };
}