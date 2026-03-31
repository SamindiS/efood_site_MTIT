const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            results.push(file);
        }
    });
    return results;
}

const dir = path.join(__dirname, 'src');
const files = walk(dir);

let count = 0;
files.forEach(file => {
    if(file.endsWith('.js') || file.endsWith('.jsx')) {
        let content = fs.readFileSync(file, 'utf8');
        let oldContent = content;
        
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
    }
});
console.log(`Updated ${count} files.`);
