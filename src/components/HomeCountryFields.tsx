"use client";

import { useState } from "react";
import { BILLING_CURRENCIES } from "@/lib/checkout-currency";
import { HOME_COUNTRIES, isHomeCountry, suggestedBillingCurrency } from "@/lib/home-countries";
import { US_STATES } from "@/lib/us-states";

const US_HOME_STATES = US_STATES.filter((state) => state.code !== "OUT");

export default function HomeCountryFields({
  defaultCountry = "",
  defaultRegion = "",
}: {
  defaultCountry?: string;
  defaultRegion?: string;
}) {
  const initialCountry = isHomeCountry(defaultCountry) ? defaultCountry : "";
  const [country, setCountry] = useState(initialCountry);
  const [currency, setCurrency] = useState(suggestedBillingCurrency(initialCountry));
  const [currencyTouched, setCurrencyTouched] = useState(false);
  const unitedStates = country === "United States";

  return (
    <>
      <label>
        Country you live in
        <select
          name="country"
          required
          value={country}
          onChange={(event) => {
            const next = event.target.value;
            setCountry(next);
            if (!currencyTouched) setCurrency(suggestedBillingCurrency(next));
          }}
        >
          <option value="" disabled>
            Select
          </option>
          {HOME_COUNTRIES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <label>
        {unitedStates ? "State" : "State, province or region"}
        {unitedStates ? (
          <select key="us-state" name="usState" required defaultValue={defaultRegion}>
            <option value="" disabled>
              Select
            </option>
            {US_HOME_STATES.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            key="region"
            name="usState"
            required
            defaultValue={defaultRegion}
            autoComplete="address-level1"
            placeholder="e.g. Ontario, Dubai, Lagos"
          />
        )}
      </label>
      <label className="enroll-span">
        Pay in
        <select
          name="billingCurrency"
          required
          value={currency}
          onChange={(event) => {
            setCurrencyTouched(true);
            setCurrency(event.target.value);
          }}
        >
          {BILLING_CURRENCIES.map((item) => (
            <option key={item.code} value={item.code}>
              {item.label} ({item.code})
            </option>
          ))}
        </select>
      </label>
    </>
  );
}
