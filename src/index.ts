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
	"$p": {hour: "numeric", hourCycle: "h12"},
	"$P": {dayPeriod: "long"},
	"$z": {timeZoneName: "short"},
	"$Z": {timeZoneName: "long"},
};

const numericTokens = new Set(["%m", "%M", "%d", "%D", "%h", "%H", "%g", "%G", "%i", "%I", "%s", "%S"]);
const paddedTokens = new Set(["%M", "%D", "%H", "%G", "%I", "%S"]);

export function dateFormat(format: string, date: Date | string = new Date(), lang: string = "en-GB", timeZone?: string) {
	const replacements: Record<string, string> = {};
	if (typeof date === "string") date = new Date(date);
	let zero: string | undefined;

	Object.entries(formatters).filter(([key]) => format.includes(key)).forEach(([key, options]) => {
		// $p is the conventional am/pm marker; $P remains a localized day period.
		const locale = key === "$p" ? "en-GB" : lang;
		const cacheKey = `${key}|${locale}|${timeZone ?? ""}`;
		let formatter = formatterCache.get(cacheKey);
		if (!formatter) {
			formatter = new Intl.DateTimeFormat(locale, {...options, ...(timeZone ? {timeZone} : {})});
			formatterCache.set(cacheKey, formatter);
		}
		const part = key === "$p" ? "dayPeriod" : Object.keys(options)[0];
		let value = formatter.formatToParts(date).find(item => item.type === part)?.value ?? "";

		if (numericTokens.has(key)) {
			zero ??= new Intl.NumberFormat(lang, {useGrouping: false}).format(0);
			const digits = Array.from(value);
			while (digits.length > 1 && digits[0] === zero) digits.shift();
			if (paddedTokens.has(key) && digits.length === 1) digits.unshift(zero);
			value = digits.join("");
		}
		if (key === "$p") value = value.toLowerCase();
		replacements[key] = value;
	});

	return format.replace(/%[YyMmDdhHgGiIsS]|\$[mMdDwWpPzZ]/g, (match) => replacements[match] ?? match);
}
