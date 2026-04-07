const formatterCache: Record<string, Intl.DateTimeFormat> = {};

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
	"%h": {hour: "numeric", hour12: false},
	"%H": {hour: "2-digit", hour12: false},
	"%g": {hour: "numeric", hour12: true},
	"%G": {hour: "2-digit", hour12: true},
	"%i": {minute: "numeric"},
	"%I": {minute: "2-digit"},
	"%s": {second: "numeric"},
	"%S": {second: "2-digit"},
	"$p": {dayPeriod: "short"},
	"$P": {dayPeriod: "long"},
	"$z": {timeZoneName: "short"},
	"$Z": {timeZoneName: "long"},
};

export function dateFormat(format: string, date: Date | string = new Date(), lang: string = "en-GB", timeZone?: string) {
	const replacements: Record<string, string> = {};
	if (typeof date === "string") date = new Date(date);

	Object.entries(formatters).filter(([key]) => format.includes(key)).forEach(([key, options]) => {
		const cacheKey = `${key}|${lang}|${timeZone ?? ""}`;
		const formatter = formatterCache[cacheKey] ??= new Intl.DateTimeFormat(lang, {...options, ...(timeZone ? {timeZone} : {})});
		let value = formatter.format(date);

		if (["%M", "%D", "%H", "%G", "%I", "%S"].includes(key)) {
			value = value.padStart(2, "0");
		}
		value = value.replaceAll(".", "");
		replacements[key] = value;
	});

	return format.replace(/%[YyMmDdhHgGiIsS]|\$[mMdDwWpPzZ]/g, (match) => replacements[match] ?? match);
}
