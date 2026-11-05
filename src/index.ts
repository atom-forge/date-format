const MAX_CACHED_FORMATTERS = 500;
const formatterCache = new Map<string, Intl.DateTimeFormat>();

const formatters: Record<string, Intl.DateTimeFormatOptions> = {
	"%Y": {year: "numeric"},
	"%y": {year: "2-digit"},
	"%m": {month: "numeric"},
	"%M": {month: "2-digit"},
	"$m": {month: "short"},
	"$M": {month: "long"},
	"%d": {day: "numeric"},
	"%D": {day: "2-digit"},
	"$d": {weekday: "narrow"},
	"$D": {weekday: "long"},
	"$w": {weekday: "short"},
	"$W": {weekday: "long"},
	"%h": {hour: "numeric", hourCycle: "h23"},
	"%H": {hour: "2-digit", hourCycle: "h23"},
	"%g": {hour: "numeric", hourCycle: "h12"},
	"%G": {hour: "2-digit", hourCycle: "h12"},
	"%i": {minute: "numeric"},
	"%I": {minute: "2-digit"},
	"%s": {second: "numeric"},
	"%S": {second: "2-digit"},
	"%L": {fractionalSecondDigits: 3},
	"$p": {hour: "numeric", hourCycle: "h12"},
	"$P": {dayPeriod: "long"},
	"%z": {timeZoneName: "longOffset"},
	"$z": {timeZoneName: "short"},
	"$Z": {timeZoneName: "long"},
};

const partTypes: Record<string, string[]> = {
	"%Y": ["year", "relatedYear"],
	"%y": ["year", "relatedYear"],
	"%L": ["fractionalSecond"],
	"$p": ["dayPeriod"],
};

const numericTokens = new Set(["%m", "%M", "%d", "%D", "%h", "%H", "%g", "%G", "%i", "%I", "%s", "%S"]);
const paddedTokens = new Set(["%M", "%D", "%H", "%G", "%I", "%S"]);
const monthNameTokens = new Set(["$m", "$M"]);
const tokenPattern = /%%|\$\$|%[YyMmDdhHgGiIsSLz]|\$[mMdDwWpPzZ]/g;

function getFormatter(cacheKey: string, locale: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
	let formatter = formatterCache.get(cacheKey);
	if (!formatter) {
		formatter = new Intl.DateTimeFormat(locale, options);
		if (formatterCache.size >= MAX_CACHED_FORMATTERS) formatterCache.delete(formatterCache.keys().next().value!);
		formatterCache.set(cacheKey, formatter);
	}
	return formatter;
}

function extract(formatter: Intl.DateTimeFormat, date: Date, types: string[]): string {
	const parts = formatter.formatToParts(date);
	for (const type of types) {
		const value = parts.find(item => item.type === type)?.value;
		if (value !== undefined) return value;
	}
	return "";
}

function toDate(date: Date | string | number): Date {
	if (date === null) throw new TypeError("dateFormat: date must be a Date, string or number, not null");
	const instant = date instanceof Date ? date : new Date(date);
	if (Number.isNaN(instant.getTime())) throw new RangeError(`dateFormat: invalid date: ${String(date)}`);
	return instant;
}

export function dateFormat(format: string, date: Date | string | number = new Date(), lang: string = "en-GB", timeZone?: string): string {
	const instant = toDate(date);
	const tzOptions: Intl.DateTimeFormatOptions = timeZone ? {timeZone} : {};
	const tzKey = timeZone ?? "";
	const replacements: Record<string, string> = {"%%": "%", "$$": "$"};
	// Month names next to a day of month use the contextual (e.g. genitive) form in inflecting languages.
	const withDay = /%[dD]/.test(format);
	let zero: string | undefined;

	for (const match of new Set(format.match(tokenPattern))) {
		if (match in replacements) continue;
		const options = formatters[match];
		// $p is the conventional am/pm marker and %z a machine-readable offset; both are locale-independent.
		const locale = match === "$p" || match === "%z" ? "en-US" : lang;
		const types = partTypes[match] ?? [Object.keys(options)[0]];
		let value = extract(getFormatter(`${match}|${locale}|${tzKey}`, locale, {...options, ...tzOptions}), instant, types);

		if (withDay && monthNameTokens.has(match)) {
			const contextual = extract(getFormatter(`${match}+day|${locale}|${tzKey}`, locale, {day: "numeric", ...options, ...tzOptions}), instant, types);
			// Some locales (e.g. ja, zh, fi short) render the month numerically next to a day; keep the name then.
			if (/\p{L}/u.test(contextual)) value = contextual;
		}
		if (numericTokens.has(match)) {
			zero ??= new Intl.NumberFormat(lang, {useGrouping: false}).format(0);
			const digits = Array.from(value);
			while (digits.length > 1 && digits[0] === zero) digits.shift();
			if (paddedTokens.has(match) && digits.length === 1) digits.unshift(zero);
			value = digits.join("");
		}
		if (match === "$p") value = value.toLowerCase();
		if (match === "%z") value = value === "GMT" ? "+00:00" : value.replace(/^GMT/, "");
		replacements[match] = value;
	}

	return format.replace(tokenPattern, (match) => replacements[match] ?? match);
}
