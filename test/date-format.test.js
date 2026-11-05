import {test} from "node:test";
import assert from "node:assert/strict";
import {dateFormat} from "../dist/index.js";

test("numeric tokens distinguish unpadded and two-digit values", () => {
	for (const locale of ["en-GB", "en-US", "hu-HU"]) {
		assert.equal(dateFormat("%m|%M|%d|%D|%h|%H|%g|%G|%i|%I|%s|%S", "2026-04-07T09:05:03Z", locale, "UTC"), "4|04|7|07|9|09|9|09|5|05|3|03");
		assert.equal(dateFormat("%h|%H|%g|%G", "2026-04-07T00:00:00Z", locale, "UTC"), "0|00|12|12");
		assert.equal(dateFormat("%h|%H|%g|%G", "2026-04-07T12:00:00Z", locale, "UTC"), "12|12|12|12");
	}
});

test("AM/PM follows the requested timezone independently of locale", () => {
	for (const locale of ["en-GB", "en-US", "hu-HU"]) {
		assert.equal(dateFormat("$p", "2026-04-07T09:00:00Z", locale, "UTC"), "am");
		assert.equal(dateFormat("$p", "2026-04-07T12:00:00Z", locale, "UTC"), "pm");
		assert.equal(dateFormat("$p", "2026-04-07T09:00:00Z", locale, "America/Los_Angeles"), "am");
		assert.equal(dateFormat("$p", "2026-04-07T09:00:00Z", locale, "Asia/Tokyo"), "pm");
	}
});

test("text tokens extract only their requested part and retain punctuation", () => {
	const date = new Date("2026-04-07T09:05:03Z");
	for (const locale of ["en-GB", "en-US", "hu-HU"]) {
		for (const [token, options, part] of [["$z", {timeZoneName: "short"}, "timeZoneName"], ["$Z", {timeZoneName: "long"}, "timeZoneName"], ["$P", {dayPeriod: "long"}, "dayPeriod"], ["$m", {month: "short"}, "month"]]) {
			const expected = new Intl.DateTimeFormat(locale, {...options, timeZone: "UTC"}).formatToParts(date).find(item => item.type === part).value;
			assert.equal(dateFormat(token, date, locale, "UTC"), expected);
		}
	}
	assert.equal(dateFormat("$z", date, "en-GB", "UTC"), "UTC");
});

test("numeric padding preserves localized digits", () => {
	const zero = new Intl.NumberFormat("ar-EG").format(0);
	const three = new Intl.NumberFormat("ar-EG").format(3);
	assert.equal(dateFormat("%h|%H|%s|%S", "2026-04-07T00:05:03Z", "ar-EG", "UTC"), `${zero}|${zero}${zero}|${three}|${zero}${three}`);
});

test("timezone changes and DST affect the extracted hour", () => {
	assert.equal(dateFormat("%H:%I", "2026-03-29T00:30:00Z", "en-GB", "Europe/Budapest"), "01:30");
	assert.equal(dateFormat("%H:%I", "2026-03-29T01:30:00Z", "en-GB", "Europe/Budapest"), "03:30");
});

test("existing year, weekday, repeated-token and literal behavior is retained", () => {
	assert.equal(dateFormat("%Y|%y|$W|$M|%Y|%Q", "2024-12-24T09:00:00Z", "en-GB", "UTC"), "2024|24|Tuesday|December|2024|%Q");
});

test("month names use the contextual form next to a day of month", () => {
	const date = "2024-12-24T14:05:03Z";
	assert.equal(dateFormat("%d $M %Y", date, "ru-RU", "UTC"), "24 декабря 2024");
	assert.equal(dateFormat("%d $M", date, "pl-PL", "UTC"), "24 grudnia");
	assert.equal(dateFormat("%d. $M %Y", date, "cs-CZ", "UTC"), "24. prosince 2024");
	assert.equal(dateFormat("$M %Y", date, "ru-RU", "UTC"), "декабрь 2024");
	assert.equal(dateFormat("%Y. $M %d.", date, "hu-HU", "UTC"), "2024. december 24.");
	assert.equal(dateFormat("$D, $M %d, %Y", date, "en-GB", "UTC"), "Tuesday, December 24, 2024");
	assert.equal(dateFormat("%d $M", date, "fi-FI", "UTC"), "24 joulukuuta");
	// Where the contextual form is numeric, the standalone month name is kept.
	for (const [locale, token] of [["ja-JP", "$m"], ["ja-JP", "$M"], ["zh-CN", "$M"], ["fi-FI", "$m"], ["lt-LT", "$m"], ["cs-CZ", "$m"]]) {
		assert.equal(dateFormat(`%d ${token}`, date, locale, "UTC").split(" ")[1], dateFormat(token, date, locale, "UTC"));
	}
});

test("weekday tokens", () => {
	assert.equal(dateFormat("$d|$w|$D|$W", "2024-12-24T09:00:00Z", "en-GB", "UTC"), "T|Tue|Tuesday|Tuesday");
});

test("doubled prefixes escape literal % and $", () => {
	const date = "2024-12-24T14:05:03Z";
	assert.equal(dateFormat("50%%discount $$Day %d", date, "en-GB", "UTC"), "50%discount $Day 24");
	assert.equal(dateFormat("%%Y=%Y $$$M", date, "en-GB", "UTC"), "%Y=2024 $December");
});

test("milliseconds and numeric UTC offset", () => {
	const date = new Date("2024-12-24T14:05:03.007Z");
	assert.equal(dateFormat("%H:%I:%S.%L", date, "en-GB", "UTC"), "14:05:03.007");
	assert.equal(dateFormat("%z", date, "en-GB", "UTC"), "+00:00");
	assert.equal(dateFormat("%z", date, "hu-HU", "Europe/Budapest"), "+01:00");
	assert.equal(dateFormat("%z", date, "en-GB", "America/New_York"), "-05:00");
	assert.equal(dateFormat("%z", date, "ar-EG", "Asia/Kolkata"), "+05:30");
	assert.equal(dateFormat("%Y-%M-%DT%H:%I:%S%z", date, "en-GB", "Europe/Budapest"), "2024-12-24T15:05:03+01:00");
});

test("non-Gregorian calendars expose the related Gregorian year when no numeric year exists", () => {
	assert.equal(dateFormat("%Y", "2024-12-24T14:05:03Z", "zh-CN-u-ca-chinese", "UTC"), "2024");
});

test("date input: numbers are accepted, invalid values throw", () => {
	assert.equal(dateFormat("%Y-%M-%D", Date.UTC(2024, 11, 24), "en-GB", "UTC"), "2024-12-24");
	assert.throws(() => dateFormat("%Y", "nonsense"), RangeError);
	assert.throws(() => dateFormat("%Y", new Date(NaN)), RangeError);
	assert.throws(() => dateFormat("%Y", null), TypeError);
	assert.equal(typeof dateFormat("%Y", undefined, "en-GB", "UTC"), "string");
});
