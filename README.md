# rnss

Better style sheets for React Native

## Installation

`npm install --save rnss`

## Usage

rnss is a wrapper for `StyleSheet.create`. Styles are created in template strings, and rules are separated by new lines or semi colons.

```javascript
import r from 'rnss';

const containerStyle = r`
  flex 1; flex-direction row
  background-color #fff
  shadow-opacity {
    width 4
    height 5
  }
`;
```

## Property Names

style property names can be written in the following ways, camelCase, dash-case, or shorthands. So the following are all equivalent.

```javascript
r`flex 1; flex-direction row; background-color #fff`;

r`flex 1; flexDirection row; backgroundColor #fff`;

r`f 1; fd row; bc #fff`;
```

## Helpers

rnss ships with the following css style headers:

**margin/m, padding/p, border-width/bw**  
You can use these three helpers to set the corresponding property on all four sides.

```javascript
r`m 1 2 3 4`; // === { marginTop: 1, marginRight: 2, marginBottom: 3, marginLeft: 4 }
r`m 1 2 3`; // === { marginTop: 1, marginRight: 2, marginBottom: 2, marginLeft: 2 }
r`m 1 2`; // === { marginTop: 1, marginRight: 2, marginBottom: 1, marginLeft: 2 }
r`m 1`; // === { marginTop: 1, marginRight: 1, marginBottom: 1, marginLeft: 1 }
```

**border-radius/br**
This works similarly to the previous helpers but sets the `borderRadius` property on all 4 corners.

```javascript
r`br 1 2 3 4`; // === { borderTopLeftRadius: 1, borderTopRightRadius: 2, borderBottomRightRadius: 3, borderBottomLeftRadius: 4 }
r`br 1 2 3`; // === { borderTopLeftRadius: 1, borderTopRightRadius: 2, borderBottomRightRadius: 3, borderBottomLeftRadius: 2 }
r`br 1 2`; // === { borderTopLeftRadius: 1, borderTopRightRadius: 2, borderBottomRightRadius: 1, borderBottomLeftRadius: 2 }
r`br 1`; // === { borderTopLeftRadius: 1, borderTopRightRadius: 1, borderBottomRightRadius: 1, borderBottomLeftRadius: 1 }
```

**border/b**
This helper is used to set the `borderWidth`, `borderStyle`, and `borderColor` properties simultaneously.

```javascript
r`b 1 solid black`; // === { borderWidth: 1, borderStyle: 'solid', borderColor: 'black' }
```

## Hairline Width

`hairlineWidth`, `hairline-width`, or `hw` will be replaced by `StyleSheet.hairlineWidth`. So the following are equivalent:

```javascript
r`border-width ${StyleSheet.hairlineWidth}`;
r`border-width hw`;
```

## Custom Helpers

Along side the built in helpers, you can also create your own custom helpers using the `r.helper` function.

```javascript
r.helper({
  flexRow: r`f 1; fd row`,
  bigMargin: num => r`m ${num * 10}`
});

r`flex-row`; // === { flex: 1, flexDirection: 'row' }
r`big-margin 5`; // === { margin: 50 }
```

## Variables

You can define variables for your styles using the `r.vars` function. Simply pass in an object containing all the variables for your application, then reference it in your style using `$varName`.

```javascript
r.vars({ bc: '#fff' });

r`bc $bc`; // === { backgroundColor: '#fff' }
```

Keep in mind that changing the variables invalidates the current cached styles, so frequent variable updates may cause performance issues.

You can also view all the current defined vars by calling `r.vars` without any parameters.

```javascript
r.vars({ bc: '#fff' });

r.vars().bc; // === '#fff'
```

## Syntax Highlighting

You can use syntax highlighting in Visual Studio Code by using the [Highlight CSS Lean Strings](https://marketplace.visualstudio.com/items?itemName=fuzetsu.highlight-css-lean-strings) extension.
