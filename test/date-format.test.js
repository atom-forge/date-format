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
