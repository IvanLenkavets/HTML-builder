const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');
let input = readline.createInterface(process.stdin);

console.log('Введите текст:');

input.on('line', (text) => {
  if (text === 'CTRL+C') {
    console.log('Выход');
    process.exit(0);
  }
  
  fs.appendFile(filePath, text + '\n', (err) => {
    if (err) throw err;
    console.log(`Текст "${text}" записан в файл.`);
  });
});
