const fs = require('fs');
const path = require('path');

function walk(dir) {
    if(!fs.existsSync(dir)) return [];
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git') && !file.includes('dist') && !file.includes('build')) { 
            results = results.concat(walk(fullPath));
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) { 
            results.push(fullPath);
        }
    });
    return results;
}

const dir = __dirname;
const files = walk(dir);

let count = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let oldContent = content;
    
    // Ignore backend code, only process files that look like UI code (e.g. they import react, are in a src folder, or have JSX)
    if (!file.includes(`${path.sep}src${path.sep}`)) return;

    content = content.replace(/http:\/\/localhost:5000/g, 'http://localhost:5010/restaurant-service');
    content = content.replace(/http:\/\/localhost:5001/g, 'http://localhost:5010/order-service');
    content = content.replace(/http:\/\/localhost:5002/g, 'http://localhost:5010/delivery-service');
    content = content.replace(/http:\/\/localhost:5003/g, 'http://localhost:5010/payment-service');
    content = content.replace(/http:\/\/localhost:5004/g, 'http://localhost:5010/review-service');
    content = content.replace(/http:\/\/localhost:5005/g, 'http://localhost:5010/loyalty-service');
    
    if(content !== oldContent) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated', file);
        count++;
    }
});
console.log(`Updated ${count} files across all projects.`);
