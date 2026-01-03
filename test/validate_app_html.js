const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/public/app/index.html');

console.log(`Validating ${filePath}...`);

try {
    const content = fs.readFileSync(filePath, 'utf8');
    let errors = [];

    // Test 1: Bootstrap removed
    if (content.includes('bootstrap.min.css')) {
        errors.push('FAIL: Bootstrap CSS link still present.');
    }

    // Test 2: Tailwind added
    if (!content.includes('cdn.tailwindcss.com')) {
        errors.push('FAIL: Tailwind CSS script not found.');
    }

    // Test 3: Theme Config
    if (!content.includes('tailwind.config') || !content.includes('void:') || !content.includes('#0d0208')) {
        errors.push('FAIL: Tailwind config or "void" color definition not found.');
    }

    // Test 4: Fonts
    if (!content.includes('family=VT323') || !content.includes('family=Space+Mono')) {
        errors.push('FAIL: Google Fonts links for VT323 and Space Mono not found.');
    }

    // Test 5: Critical IDs
    const requiredIds = ['loading', 'content', 'username'];
    requiredIds.forEach(id => {
        if (!content.includes(`id="${id}"`) && !content.includes(`id='${id}'`)) {
            errors.push(`FAIL: Required ID "${id}" not found.`);
        }
    });

    if (errors.length > 0) {
        console.error('Validation Failed:');
        errors.forEach(err => console.error(`- ${err}`));
        process.exit(1);
    } else {
        console.log('PASS: All structural checks passed.');
    }

} catch (err) {
    console.error('Error reading file:', err);
    process.exit(1);
}
