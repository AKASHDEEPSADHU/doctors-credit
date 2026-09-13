"use client";

import { useMemo, useState } from "react";
import { TREATMENTS } from "@/lib/treatments";

function money(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.max(0, n));
}

const INDIA_BASE: Record<string, number> = {
  "knee-replacement": 6500,
  "hip-replacement": 7200,
  ivf: 3500,
  "dental-implants": 1800,
  cabg: 9000,
  cataract: 1200,
};

export default function CostCalculator() {
  const [procedure, setProcedure] = useState("knee-replacement");
  const [insured, setInsured] = useState("insured");
  const [billed, setBilled] = useState(45000);
  const [deductibleLeft, setDeductibleLeft] = useState(4000);
  const [coinsurance, setCoinsurance] = useState(20);
  const [oopMax, setOopMax] = useState(8500);
  const [copay, setCopay] = useState(500);
  const [indiaCare, setIndiaCare] = useState(6500);
  const [flights, setFlights] = useState(1400);
  const [visa, setVisa] = useState(200);
  const [hotel, setHotel] = useState(900);
  const [local, setLocal] = useState(250);
  const [companion, setCompanion] = useState(1200);
  const [follow, setFollow] = useState(400);
  const [contingency, setContingency] = useState(500);

  const usExposure = useMemo(() => {
    if (insured === "uninsured") return billed + copay;
    const afterDeductible = Math.max(0, billed - deductibleLeft);
    const coins = afterDeductible * (coinsurance / 100);
    const raw = deductibleLeft + coins + copay;
    return Math.min(raw, oopMax);
  }, [insured, billed, deductibleLeft, coinsurance, oopMax, copay]);

  const indiaTotal =
    indiaCare + flights + visa + hotel + local + companion + follow + contingency;
  const delta = usExposure - indiaTotal;

  return (
    <form className="calc" onSubmit={(e) => e.preventDefault()}>
      <p className="tag">Estimate only</p>
      <h3>Compare the total cost of the journey</h3>
      <p className="muted">
        Compare expected costs at home with a complete India journey. The
        deductible and out-of-pocket fields are a United States plan example.
        India figures are journey estimates, not quotes.
      </p>
      <div className="calc-grid">
        <label>
          Procedure
          <select
            value={procedure}
            onChange={(e) => {
              setProcedure(e.target.value);
              setIndiaCare(INDIA_BASE[e.target.value] ?? 5000);
            }}
          >
            {TREATMENTS.filter((t) => t.suitability !== "NOT GENERALLY").map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Coverage or funding
          <select value={insured} onChange={(e) => setInsured(e.target.value)}>
            <option value="insured">Has coverage (United States plan example)</option>
            <option value="uninsured">Paying yourself / cash</option>
          </select>
        </label>
        <label>
          Estimated procedure price at home
          <input type="number" min={0} value={billed} onChange={(e) => setBilled(+e.target.value)} />
        </label>
        <label>
          Remaining deductible (US plan example)
          <input
            type="number"
            min={0}
            value={deductibleLeft}
            onChange={(e) => setDeductibleLeft(+e.target.value)}
          />
        </label>
        <label>
          Coinsurance % (US plan example)
          <input
            type="number"
            min={0}
            max={100}
            value={coinsurance}
            onChange={(e) => setCoinsurance(+e.target.value)}
          />
        </label>
        <label>
          Out-of-pocket maximum (US plan example)
          <input type="number" min={0} value={oopMax} onChange={(e) => setOopMax(+e.target.value)} />
        </label>
        <label>
          Copay / extra
          <input type="number" min={0} value={copay} onChange={(e) => setCopay(+e.target.value)} />
        </label>
        <label>
          India treatment estimate
          <input type="number" min={0} value={indiaCare} onChange={(e) => setIndiaCare(+e.target.value)} />
        </label>
        <label>
          Flights
          <input type="number" min={0} value={flights} onChange={(e) => setFlights(+e.target.value)} />
        </label>
        <label>
          Visa
          <input type="number" min={0} value={visa} onChange={(e) => setVisa(+e.target.value)} />
        </label>
        <label>
          Hotel / stay
          <input type="number" min={0} value={hotel} onChange={(e) => setHotel(+e.target.value)} />
        </label>
        <label>
          Local transport
          <input type="number" min={0} value={local} onChange={(e) => setLocal(+e.target.value)} />
        </label>
        <label>
          Companion expenses
          <input type="number" min={0} value={companion} onChange={(e) => setCompanion(+e.target.value)} />
        </label>
        <label>
          Follow-up / tests
          <input type="number" min={0} value={follow} onChange={(e) => setFollow(+e.target.value)} />
        </label>
        <label>
          Emergency contingency
          <input
            type="number"
            min={0}
            value={contingency}
            onChange={(e) => setContingency(+e.target.value)}
          />
        </label>
      </div>
      <div className="result">
        <dl>
          <div>
            <dt>Estimated cost at home</dt>
            <dd>{money(usExposure)}</dd>
          </div>
          <div>
            <dt>Estimated total India journey cost</dt>
            <dd>{money(indiaTotal)}</dd>
          </div>
          <div>
            <dt>Potential estimated difference</dt>
            <dd>
              {delta >= 0 ? `${money(delta)} lower in India` : `${money(-delta)} lower at home`}
            </dd>
          </div>
        </dl>
        <p className="source">
          Estimate only. Not a quote, not a guarantee, and not medical advice. We
          compare what you may need to pay yourself, not hospital sticker
          prices alone.
        </p>
      </div>
    </form>
  );
}
