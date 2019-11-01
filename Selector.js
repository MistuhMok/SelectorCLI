const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);
const prefix = 'Select: ';

//Line event is emitted whenever input stream receives an end of line input
rl.on('line', function(line) {
  switch (line.trim()) {
    case 'help':
      console.log('me!');
      break;
    case 'exit':
      rl.close();
    default:
      console.log(`'${line.trim()}' is not a valid input`);
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
