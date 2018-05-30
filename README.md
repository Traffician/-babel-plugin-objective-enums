# @babel/plugin-objective-enums

Extended plugin sample for Babel.

It requires Babel 7 or higher.

## Installation

```sh
$ npm install --save-dev @babel/plugin-objective-enums
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["@babel/plugin-objective-enums"]
}
```

### Via CLI

```sh
$ babel --plugins @babel/plugin-objective-enums script.js
```

### Via Node API

```javascript
require('@babel/core').transform('code', {
  plugins: ['@babel/plugin-objective-enums']
});
```

## All-in-one Example
```typescript
enum Colors {
  Red = '#FF0000',
  Yellow = {r: 255, g: 255, b: 0},
  Green = 0x008000,
  Blue = true,
  White,
  Black = White * 50
}

// Get color value and name
console.log(Colors.Red.value + ' - ' + Colors.Red.toString()); // #FF0000 - Red

// Only green and blue are allowed colors
let allowed = Colors.Green | Colors.Blue;
 
// Get names of allowed colors
console.log(Colors.match(allowed)); // ["Green", "Blue"]
 
// Add yellow to allowed colors
allowed |= Colors.Yellow;
console.log(Colors.match(allowed)); // ["Green", "Blue", "Yellow"]

// Remove blue from allowed colors
allowed &= ~Colors.Blue;
console.log(Colors.match(allowed)); // ["Green", "Yellow"]

// Get common elements' names of allowed and selected colors
const selected = Colors.Red | Colors.Yellow | Colors.Black;
console.log(Colors.intersect(allowed, selectedColors)); // ["Yellow"]
```
