"use client";

import { useMemo, useState } from "react";
import type { SlotCalendar } from "@/lib/appointment-slots";

export default function AppointmentSlotPicker({ calendar }: { calendar: SlotCalendar }) {
  const firstOpen = calendar.dates.find((day) => day.available)?.date || "";
  const [date, setDate] = useState(firstOpen);
  const [time, setTime] = useState("");
  const selectedDay = useMemo(
    () => calendar.dates.find((day) => day.date === date) || null,
    [calendar.dates, date]
  );

  return (
    <fieldset className="slot-picker enroll-span">
      <legend>Choose a conversation date and time</legend>
      <p className="slot-timezone">Times shown in {calendar.timezoneLabel}</p>
      <p className="slot-hint">These are published DCredit coordinator windows, not a live staff calendar.</p>

      <p className="slot-label" id="slot-dates-label">
        Date
      </p>
      <div className="slot-dates" role="radiogroup" aria-labelledby="slot-dates-label">
        {calendar.dates.map((day) => (
          <label key={day.date} className={day.date === date ? "slot-card is-selected" : "slot-card"}>
            <input
              type="radio"
              name="preferredConsultationDate"
              value={day.date}
              checked={day.date === date}
              disabled={!day.available}
              onChange={() => {
                setDate(day.date);
                setTime("");
              }}
            />
            <span className="slot-card-weekday">{day.weekday}</span>
            <span className="slot-card-date">{day.label.replace(/^[A-Za-z]{3}\s/, "")}</span>
          </label>
        ))}
      </div>

      <p className="slot-label" id="slot-times-label">
        Available times
      </p>
      <div className="slot-times" role="radiogroup" aria-labelledby="slot-times-label">
        {(selectedDay?.times || []).map((slot) => (
          <label
            key={slot.time}
            className={slot.time === time && slot.available ? "slot-card slot-time is-selected" : "slot-card slot-time"}
          >
            <input
              type="radio"
              name="appointmentTime"
              value={slot.time}
              checked={slot.time === time}
              disabled={!slot.available}
              onChange={() => setTime(slot.time)}
              required
            />
            <span>{slot.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
