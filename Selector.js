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
      console.table(search('Input', data));
      break;
    default:
      parseInput(line);
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

const parseInput = input => {
  let firstChar = input[0].charCodeAt();
  let results = [];

  //If the first character is between A-Z
  if (firstChar >= 65 && firstChar <= 90) {
    results = search(input, data, 'class');
  } else {
    input = input.slice(1);

    //If the first character is a '.'
    if (firstChar === 46) {
      results = search(input, data, 'classNames');
    }
    //If the first character is a '#'
    if (firstChar === 35) {
      results = search(input, data, 'identifier');
    }
  }
  console.table(results.length > 0 ? results : 'No valid results.');
};

const search = (input, data, type) => {
  const searchValues = ['subviews', 'contentView', 'control'];
  let results = [];

  //classNames are inside an array instead of a key value pair
  if (
    data[type] && type === 'classNames'
      ? data[type].includes(input)
      : data[type] === input
  ) {
    results.push(data);
  }

  //If data is an array
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      results.push(...search(input, data[i], type));
    }
  }

  searchValues.forEach(element => {
    //subviews stores arrays and contentView + control stores objects
    const curr = data[element];
    if (curr) {
      //If data is an array
      if (Array.isArray(curr)) {
        for (let i = 0; i < curr.length; i++) {
          results.push(...search(input, curr[i], type));
        }
      } else {
        //If data is an object
        for (let obj in curr) {
          if (curr[obj] === input && obj === type) {
            results.push(curr);
          }
          results.push(...search(input, curr[obj], type));
        }
      }
    }
  });

  return results;
};
