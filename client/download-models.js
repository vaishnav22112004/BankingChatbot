const https = require('https');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
const modelsDir = path.join(__dirname, 'public', 'models');

// Create models directory if it doesn't exist
if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
}

const files = [
    'face_recognition_model-weights_manifest.json',
    'face_recognition_model-shard1',
    'face_recognition_model-shard2',
    'face_landmark_68_model-weights_manifest.json',
    'face_landmark_68_model-shard1',
    'tiny_face_detector_model-weights_manifest.json',
    'tiny_face_detector_model-shard1'
];

// Expected file sizes in bytes (approximate)
const expectedSizes = {
    'face_recognition_model-shard1': 2000000, // ~2MB
    'face_recognition_model-shard2': 2000000, // ~2MB
    'face_landmark_68_model-shard1': 350000,  // ~350KB
    'tiny_face_detector_model-shard1': 190000  // ~190KB
};

function downloadFile(filename) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(modelsDir, filename);
        const file = fs.createWriteStream(filePath);
        
        console.log(`Downloading ${filename}...`);
        
        https.get(`${baseUrl}/${filename}`, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
                return;
            }

            let downloadedBytes = 0;
            response.on('data', (chunk) => {
                downloadedBytes += chunk.length;
            });

            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                
                // Verify file size for binary files
                if (expectedSizes[filename]) {
                    const stats = fs.statSync(filePath);
                    const sizeMB = stats.size / (1024 * 1024);
                    console.log(`Downloaded ${filename} (${sizeMB.toFixed(2)}MB)`);
                    
                    if (stats.size < expectedSizes[filename] * 0.9) { // Allow 10% margin
                        console.warn(`Warning: ${filename} size (${stats.size} bytes) is smaller than expected (${expectedSizes[filename]} bytes)`);
                    }
                } else {
                    console.log(`Downloaded ${filename}`);
                }
                
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filePath, () => {}); // Delete the file if there was an error
            reject(err);
        });
    });
}

async function downloadAllFiles() {
    try {
        // First, remove any existing files
        for (const file of files) {
            const filePath = path.join(modelsDir, file);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Removed existing ${file}`);
            }
        }

        // Then download new files
        for (const file of files) {
            await downloadFile(file);
        }
        console.log('All files downloaded successfully!');
    } catch (error) {
        console.error('Error downloading files:', error);
    }
}

downloadAllFiles(); 