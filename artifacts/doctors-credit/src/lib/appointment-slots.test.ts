import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseApplicationInput } from "./application-fields";
import {
  buildSlotCalendar,
  formatTimeLabel,
  parseSelectedSlot,
  scheduleTimezone,
  scheduleTimezoneLabel,
} from "./appointment-slots";

const NOW = new Date("2026-09-14T12:00:00Z");

function sampleFields(slot: { preferredConsultationDate: string; appointmentTime: string }) {
  return {
    firstName: "Pat",
    lastName: "Example",
    phone: "555-0100",
    usState: "CA",
    country: "United States",
    procedureCategory: "Orthopedics",
    procedure: "Knee replacement",
    insuranceStatus: "Private insurance",
    estimatedUsOop: "unknown",
    preferredTimeline: "Flexible / exploring",
    ...slot,
    sku: "orientation",
  };
}

describe("appointment slots", () => {
  it("renders published dates and times with an explicit timezone", () => {
    const calendar = buildSlotCalendar([], NOW);
    assert.equal(calendar.timezone, scheduleTimezone());
    assert.equal(calendar.timezoneLabel, scheduleTimezoneLabel());
    assert.ok(calendar.dates.length > 0);
    assert.ok(calendar.dates[0].times.length >= 6);
    assert.equal(formatTimeLabel("09:00"), "9:00 AM");
    assert.equal(formatTimeLabel("13:00"), "1:00 PM");
    assert.match(calendar.timezoneLabel, /Time|time|Eastern|Pacific|UTC/);
  });

  it("accepts one configured slot and persists date plus time", () => {
    const calendar = buildSlotCalendar([], NOW);
    const open = calendar.dates.find((day) => day.available);
    const time = open?.times.find((slot) => slot.available);
    assert.ok(open && time);
    const parsed = parseSelectedSlot(open.date, time.time, [], NOW);
    assert.equal(parsed.ok, true);
    if (parsed.ok) {
      assert.equal(parsed.slot.date, open.date);
      assert.equal(parsed.slot.time, time.time);
      assert.equal(parsed.slot.timezone, calendar.timezone);
    }
  });

  it("rejects an unavailable or arbitrary client-supplied time", () => {
    const calendar = buildSlotCalendar([], NOW);
    const open = calendar.dates.find((day) => day.available);
    assert.ok(open);
    const taken = parseSelectedSlot(open.date, "10:00", [{ date: open.date, time: "10:00", count: 1 }], NOW);
    assert.equal(taken.ok, false);
    const arbitrary = parseSelectedSlot(open.date, "16:45", [], NOW);
    assert.equal(arbitrary.ok, false);
    const fields = parseApplicationInput(sampleFields({ preferredConsultationDate: open.date, appointmentTime: "16:45" }), [], NOW);
    assert.ok(fields.errors.appointmentTime);
  });

  it("enforces exclusive paid capacity on the server", () => {
    const calendar = buildSlotCalendar([], NOW);
    const open = calendar.dates.find((day) => day.available);
    const time = open?.times.find((slot) => slot.available);
    assert.ok(open && time);
    const blocked = buildSlotCalendar([{ date: open.date, time: time.time, count: 1 }], NOW);
    const day = blocked.dates.find((row) => row.date === open.date);
    assert.equal(day?.times.find((slot) => slot.time === time.time)?.available, false);
    const parsed = parseSelectedSlot(open.date, time.time, [{ date: open.date, time: time.time, count: 1 }], NOW);
    assert.equal(parsed.ok, false);
  });
});
