import { StyleSheet } from 'react-native';

const isEqual = (a, b) => {
	if (a === b) return true;
	if (a == null || b == null) return a == null && b == null;
	const ak = Object.keys(a);
	if (ak.length !== Object.keys(b).length) return false;
	for (const k of ak) if (a[k] !== b[k]) return false;
	return true;
};

const props = [
	'alignContent',
	'alignItems',
	'alignSelf',
	'aspectRatio',
	'borderBottomWidth',
	'borderLeftWidth',
	'borderRightWidth',
	'borderTopWidth',
	'borderEndWidth',
	'borderStartWidth',
	'borderWidth',
	'bottom',
	'direction',
	'display',
	'end',
	'start',
	'flex',
	'flexDirection',
	'flexBasis',
	'flexGrow',
	'flexShrink',
	'flexWrap',
	'height',
	'justifyContent',
	'left',
	'margin',
	'marginBottom',
	'marginHorizontal',
	'marginLeft',
	'marginRight',
	'marginTop',
	'marginVertical',
	'marginEnd',
	'marginStart',
	'maxHeight',
	'maxWidth',
	'minHeight',
	'minWidth',
	'padding',
	'paddingBottom',
	'paddingHorizontal',
	'paddingLeft',
	'paddingRight',
	'paddingTop',
	'paddingVertical',
	'paddingEnd',
	'paddingStart',
	'position',
	'right',
	'top',
	'width',
	'zIndex',
	'shadowColor',
	'shadowOffset',
	'shadowOpacity',
	'shadowRadius',
	'decomposedMatrix',
	'transform',
	'transformMatrix',
	'backfaceVisibility',
	'backgroundColor',
	'borderBottomLeftRadius',
	'borderBottomRightRadius',
	'borderColor',
	'borderRadius',
	'borderTopLeftRadius',
	'borderTopRightRadius',
	'opacity',
	'overflow',
	'resizeMode',
	'tintColor',
	'overlayColor',
	'borderBottomColor',
	'borderLeftColor',
	'borderRightColor',
	'borderStyle',
	'borderTopColor',
	'elevation',
	'color',
	'fontFamily',
	'fontSize',
	'fontStyle',
	'fontVariant',
	'textTransform',
	'fontWeight',
	'includeFontPadding',
	'lineHeight',
	'textAlign',
	'textDecorationLine',
	'textShadowColor',
	'textShadowOffset',
	'textShadowRadius',
	'textAlignVertical',
	'letterSpacing',
	'textDecorationColor',
	'textDecorationStyle',
	'writingDirection',
	'borderBottomEndRadius',
	'borderBottomStartRadius',
	'borderEndColor',
	'borderStartColor',
	'borderTopEndRadius',
	'borderTopStartRadius'
];

const initials = str =>
	str
		.match(/^[a-z]|[A-Z]/g)
		.join('')
		.toLowerCase();

const shorts = props.reduce((obj, prop) => ((obj[initials(prop)] = prop), obj), {});

Object.assign(shorts, {
	bc: 'backgroundColor',
	d: 'display',
	e: 'elevation',
	fs: 'fontSize',
	fw: 'fontWeight',
	mh: 'minHeight',
	mw: 'minWidth',
	o: 'overflow',
	p: 'padding',
	so: 'shadowOpacity',
	t: 'top'
});

const zip = (parts, args) =>
	parts.reduce((acc, c, i) => acc + c + (args[i] == null ? '' : args[i]), '');

const memo = (fn, cache = {}) => {
	const func = x => cache[x] || (cache[x] = fn(x));
	func.clearCache = () => (cache = {});
	return func;
};

const dedash = str => str.replace(/-([a-z])/, (_, value) => value.toUpperCase());

const numOrStr = str => (isNaN(str) ? str : parseFloat(str));

const assignProps = (value, ...props) =>
	props.reduce((obj, prop) => ((obj[prop] = value), obj), {});

const propRegex = /([A-z-]+)[\t ]*((?:[\s]*\{[^}]*\})|(?:[\t ]*[^;\n]+))?/gm;

const valueReplacements = {
	...assignProps(StyleSheet.hairlineWidth, 'hairlineWidth', 'hairline-width', 'hw')
};

let vars = {};

const processValue = value => {
	value = value && value.trim();
	value.startsWith('$') && (value = vars ? vars[value.slice(1)] : null);
	return valueReplacements[value] || numOrStr(value);
};

const directions = [
	[['Top', 'Right', 'Bottom', 'Left']],
	[['Top', 'Bottom'], ['Right', 'Left']],
	[['Top'], ['Right', 'Left'], ['Bottom']],
	[['Top'], ['Right'], ['Bottom'], ['Left']]
];

const cornerDirections = [
	[['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft']],
	[['TopLeft', 'BottomRight'], ['TopRight', 'BottomLeft']],
	[['TopLeft'], ['TopRight', 'BottomLeft'], ['BottomRight']],
	[['TopLeft'], ['TopRight'], ['BottomRight'], ['BottomLeft']]
];

const processSides = (prefix, suffix = '', dirs = directions) => (...args) => {
	if (args.length <= 1) return { [prefix + suffix]: processValue(args[0]) };
	return dirs[args.length - 1].reduce(
		(obj, dir, i) =>
			args[i]
				? (dir.forEach(d => (obj[prefix + d + suffix] = processValue(args[i]))), obj)
				: obj,
		{}
	);
};

const helpers = {
	...assignProps(processSides('margin'), 'margin', 'm'),
	...assignProps(processSides('padding'), 'padding', 'p'),
	...assignProps(processSides('border', 'Width'), 'borderWidth', 'border-width', 'bw'),
	...assignProps(
		processSides('border', 'Radius', cornerDirections),
		'borderRadius',
		'border-radius',
		'br'
	),
	...assignProps(
		(width, style, color) => rnss`bw ${width}; bs ${style}; border-color ${color}`,
		'border',
		'b'
	)
};

const createStyle = memo(str => {
	const style = {};
	str.replace(propRegex, (_, key, value) => {
		key = key && dedash(key.trim());
		if (!key) return;
		value = value && value.trim();

		const helper = helpers[key];
		if (helper) {
			Object.assign(
				style,
				typeof helper === 'string'
					? createStyle(helper)
					: helper(...(value || '').split(' '))
			);
			return;
		}

		if (shorts[key]) key = shorts[key];

		if (!value) return;

		style[key] = value.startsWith('{') ? createStyle(value.slice(1, -1)) : processValue(value);
	});
	return style;
});

const rnss = (parts, ...args) =>
	StyleSheet.create({
		style: createStyle(typeof parts === 'string' ? parts : zip(parts, args))
	}).style;
rnss.helper = obj => Object.assign(helpers, obj);
rnss.vars = v => (v ? (!isEqual(vars, v) && createStyle.clearCache(), (vars = v)) : vars);

export default rnss;
