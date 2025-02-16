import fs from "fs";
const fsPromises = fs.promises;
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from 'url';
const currentDir = path.dirname(fileURLToPath(import.meta.url));
export const saveBase64Image = async (base64Data) => {
    const base64Image = base64Data.split(';base64,').pop();
    // Get file extension from base64 header or default to jpg
    let fileExtension = 'jpg';
    if (base64Data.includes('data:image/')) {
        fileExtension = base64Data.split(';')[0].split('/')[1];
    }
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = path.join(currentDir, '..', '..', 'public', 'images', fileName);
    await fsPromises.writeFile(filePath, base64Image, { encoding: 'base64' });
    return fileName;
};
