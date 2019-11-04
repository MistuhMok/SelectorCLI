const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);
const prefix = 'Select: ';
const data = require('./SystemViewController.json');

//Line event is emitted whenever input stream receives an end of line input (Like pressing enter)
rl.on('line', function(line) {
  switch (line.trim()) {
    case 'exit':
      rl.close();
    case '':
      console.log('No input entered.');
      break;
    default:
      parseInput(line);
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
  let results = [];

  //Checks a capital letter or '.' or '#' followed a word
  const regEx = /[A-Z\.#\s]\w+/g;
  const regExArray = input.match(regEx) || [];

  //If the input has a space it will search for each selector
  if (input.includes(' ')) {
    const newInput = input.split(' ');
    newInput.forEach(selector => parseInput(selector));
    return;
  }
  if (regExArray.length === 1) {
    results = checkFirstChar(input, data);
  } else if (regExArray.length > 1) {
    //If the input contains more than one selector
    results = checkFirstChar(regExArray[0], data);

    for (let i = 1; i < regExArray.length; i++) {
      let firstChar = regExArray[i].charCodeAt(0);
      let type = '';
      let searchTerm = regExArray[i];

      //If the first character is between A-Z
      if (firstChar >= 65 && firstChar <= 90) {
        type = 'class';
      } else {
        searchTerm = searchTerm.slice(1);
        //If the first character is a '.'
        if (firstChar === 46) {
          type = 'classNames';
        }
        //If the first character is a '#'
        if (firstChar === 35) {
          type = 'identifier';
        }
      }

      results = results.filter(result => {
        return result[type] && type === 'classNames'
          ? result[type].includes(searchTerm)
          : result[type] === searchTerm;
      });
    }
  }

  console.table(results.length > 0 ? results : 'No valid results.');
};

const checkFirstChar = (input, data) => {
  let firstChar = input.charCodeAt(0);
  let results = [];
  if (firstChar >= 65 && firstChar <= 90) {
    //If the first character is between A-Z
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

  return results;
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
