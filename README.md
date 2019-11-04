# SelectorCLI

'node Selector' to run

The selector supports the following selectors:
1. class - starts with a capital letter e.g. "StackView"
2. classNames - starts with a '.' e.g. ".container"
3. identifier - starts with a '#' e.g. #videoMode"
4. exit - to end the program

The results will be printed directly to the console.

#### Compound Selector
-Works with multiple selectors with no space  
-Filters results to make sure they include subsequent selectors  
-Works for both classNames and identifiers  

#### Chain Selector
-Works with multiple selectors with a space in between  
-Prints the results of each selector in it's own table  
-No limit to the number of selectors  