/**
 * V1 published coordinator conversation windows.
 *
 * These are not a live staff calendar and do not claim real-time
 * coordinator availability. Operations change this module (weekdays, times,
 * horizon, capacity) and the optional timezone env vars.
 *
 * Default timezone is America/New_York, labeled "Eastern Time", until
 * operations set DCREDIT_SCHEDULE_TIMEZONE / DCREDIT_SCHEDULE_TIMEZONE_LABEL.
 */

export const DEFAULT_SCHEDULE_TIMEZONE = "America/New_York";
export const DEFAULT_SCHEDULE_TIMEZONE_LABEL = "Eastern Time";

/** Exclusive by default: one paid application per published window. */
export const DEFAULT_SLOT_CAPACITY = 1;

const WEEKDAYS = [1, 2, 3, 4, 5] as const;
const TIMES = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"] as const;
const HORIZON_DAYS = 14;

export type OccupiedSlot = {
  date: string;
  time: string;
  count: number;
};

export type SlotTime = {
  time: string;
  label: string;
  available: boolean;
};

export type SlotDate = {
  date: string;
  label: string;
  weekday: string;
  available: boolean;
  times: SlotTime[];
};

export type SlotCalendar = {
  timezone: string;
  timezoneLabel: string;
  capacity: number;
  dates: SlotDate[];
};

export type SelectedSlot = {
  date: string;
  time: string;
  timezone: string;
  timezoneLabel: string;
  startsAt: string;
};

export function scheduleTimezone() {
  return process.env.DCREDIT_SCHEDULE_TIMEZONE || DEFAULT_SCHEDULE_TIMEZONE;
}

export function scheduleTimezoneLabel() {
  return process.env.DCREDIT_SCHEDULE_TIMEZONE_LABEL || DEFAULT_SCHEDULE_TIMEZONE_LABEL;
}

export function slotCapacity() {
  const raw = Number(process.env.DCREDIT_SLOT_CAPACITY || DEFAULT_SLOT_CAPACITY);
  if (!Number.isFinite(raw) || raw < 1) return DEFAULT_SLOT_CAPACITY;
  return Math.floor(raw);
}

export function slotKey(date: string, time: string) {
  return `${date}T${time}`;
}

export function formatTimeLabel(time: string) {
  const [hourRaw, minute] = time.split(":");
  const hour = Number(hourRaw);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute} ${suffix}`;
}

export function formatDateLabel(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(utc);
}

export function formatWeekday(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function formatAppointmentDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function ymdInZone(now: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function addDays(ymd: string, days: number) {
  const [year, month, day] = ymd.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + days));
  return next.toISOString().slice(0, 10);
}

function weekdayOf(ymd: string) {
  const [year, month, day] = ymd.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

function tzOffsetMs(date: Date, timeZone: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );
  const hour = parts.hour === "24" ? 0 : Number(parts.hour);
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    hour,
    Number(parts.minute),
    Number(parts.second)
  );
  return asUtc - date.getTime();
}

export function slotToUtcDate(date: string, time: string, timeZone: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, 0);
  const first = utcGuess - tzOffsetMs(new Date(utcGuess), timeZone);
  return new Date(utcGuess - tzOffsetMs(new Date(first), timeZone));
}

export function occupancyMap(occupied: OccupiedSlot[]) {
  const map = new Map<string, number>();
  for (const row of occupied) {
    map.set(slotKey(row.date, row.time), row.count);
  }
  return map;
}

export function isConfiguredSlot(date: string, time: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  if (!TIMES.includes(time as (typeof TIMES)[number])) return false;
  return WEEKDAYS.includes(weekdayOf(date) as (typeof WEEKDAYS)[number]);
}

export function buildSlotCalendar(
  occupied: OccupiedSlot[] = [],
  now = new Date()
): SlotCalendar {
  const timezone = scheduleTimezone();
  const timezoneLabel = scheduleTimezoneLabel();
  const capacity = slotCapacity();
  const taken = occupancyMap(occupied);
  const start = ymdInZone(now, timezone);
  const dates: SlotDate[] = [];

  for (let offset = 0; offset < HORIZON_DAYS; offset += 1) {
    const date = addDays(start, offset);
    if (!WEEKDAYS.includes(weekdayOf(date) as (typeof WEEKDAYS)[number])) continue;
    const times = TIMES.map((time) => {
      const starts = slotToUtcDate(date, time, timezone);
      const count = taken.get(slotKey(date, time)) || 0;
      const available = starts.getTime() > now.getTime() && count < capacity;
      return { time, label: formatTimeLabel(time), available };
    });
    dates.push({
      date,
      label: formatDateLabel(date),
      weekday: formatWeekday(date),
      available: times.some((slot) => slot.available),
      times,
    });
  }

  return { timezone, timezoneLabel, capacity, dates };
}

export function parseSelectedSlot(
  date: string,
  time: string,
  occupied: OccupiedSlot[] = [],
  now = new Date()
): { ok: true; slot: SelectedSlot } | { ok: false; reason: string } {
  const calendar = buildSlotCalendar(occupied, now);
  if (!isConfiguredSlot(date, time)) {
    return { ok: false, reason: "That conversation time is not available." };
  }
  const day = calendar.dates.find((row) => row.date === date);
  const slot = day?.times.find((row) => row.time === time);
  if (!day || !slot || !slot.available) {
    return { ok: false, reason: "That conversation time is not available." };
  }
  return {
    ok: true,
    slot: {
      date,
      time,
      timezone: calendar.timezone,
      timezoneLabel: calendar.timezoneLabel,
      startsAt: slotToUtcDate(date, time, calendar.timezone).toISOString(),
    },
  };
}
