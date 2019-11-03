const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);
const prefix = 'Select: ';
const data = require('./SystemViewController.json');

//Line event is emitted whenever input stream receives an end of line input (Like pressing enter)
rl.on('line', function(line) {
  switch (line.trim()) {
    case 'help':
      console.log('me!');
      break;
    case 'exit':
      rl.close();
    case 'data':
      // search(line, data);
      console.table(search('Input', data));
      break;
    default:
      console.log(line, typeof line);
      console.table(search(line, data));
      break;
  }
  rl.setPrompt(prefix, prefix.length);
  rl.prompt();
}).on('close', function() {
  console.log('Selector closed!');
  process.exit(0);
});

console.log('Please type an input');
rl.setPrompt(prefix, prefix.length);
rl.prompt();

const search = (input, data) => {
  const searchValues = ['subviews', 'contentView', 'control'];
  let type = 'class';
  if (input[0] === '.') type = 'className';
  if (input[0] === '#') type = 'identifier';

  let results = [];
  // input = 'Input';
  if (data[type] && data[type] === input) {
    results.push(data);
  }

  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      results.push(...search(input, data[i]));
    }
  }

  searchValues.forEach(element => {
    //subviews stores arrays and contentView + control stores objects
    const curr = data[element];
    if (curr) {
      //If data is an array
      if (Array.isArray(curr)) {
        for (let i = 0; i < curr.length; i++) {
          results.push(...search(input, curr[i]));
        }
      } else {
        //If data is an object
        for (let obj in curr) {
          if (curr[obj] === input) {
            results.push(curr);
          }
          results.push(...search(input, curr[obj]));
        }
      }
    }
  });

  return results;
};
