// src/services/mockDashboardData.ts

export type CarbonMetrics = {
    totalCO2: number; // in tons
    avgPerVessel: number;
    percentOffset: number; // 0 to 1
    weeklyTrend: number[];    // 7 numbers (tons) oldest->newest
    labels: string[];         // 7 labels for the trend
}
  
export type VesselStatus = {
    activeVessels: number;
    idleVessels: number;
    utilizationRate: number; // 0 to 1
    utilizationSeries: number[]; // same length as labels - percent values 0..1
    labels: string[];           // labels for utilizationSeries (same as weekly)
}
  
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) ?? "http://localhost:5000";

async function safeFetchJson(url: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`fetch failed ${res.status} ${url}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error("Network error fetching", url, err);
    return null;
  }
}

/**
 * Returns CarbonMetrics computed from /emissions
 */
export async function fetchCarbonMetrics(): Promise<CarbonMetrics> {
  const emissions = (await safeFetchJson(`${API_BASE}/emissions/`)) ?? [];
  // console.log("fetched emissions:", emissions);

  // total CO2 in kg, convert to tons
  const totalCO2Kg = emissions.reduce((s: number, e: any) => s + (Number(e?.co2_emitted) || 0), 0);
  const totalCO2 = totalCO2Kg / 1000;

  const uniqueDevices = new Set(emissions.map((e: any) => e.device_id)).size || 1;
  const avgPerVessel = totalCO2 / Math.max(uniqueDevices, 1);

  // percentOffset needs credit information; keep 0 for now (frontend can show progress).
  const percentOffset = 0;

  // Build last-7-days labels + aggregate CO2 per day (tons)
  const msPerDay = 24 * 60 * 60 * 1000;
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const labelDates: Date[] = [];
  for (let i = 6; i >= 0; i--) {
    labelDates.push(new Date(todayStart.getTime() - i * msPerDay));
  }
  const labels = labelDates.map(d => d.toLocaleDateString(undefined, { weekday: "short" }));

  const weeklyTrend = new Array<number>(7).fill(0); // tons

  for (const e of emissions) {
    const ts = e?.timestamp;
    if (!ts) continue;
    const ed = new Date(ts);
    // normalize to date start
    const edStart = new Date(ed.getFullYear(), ed.getMonth(), ed.getDate());
    const daysAgo = Math.round((todayStart.getTime() - edStart.getTime()) / msPerDay);
    // daysAgo == 0 -> today -> index 6, daysAgo==6 -> index 0
    if (daysAgo >= 0 && daysAgo <= 6) {
      const idx = 6 - daysAgo;
      weeklyTrend[idx] += (Number(e.co2_emitted) || 0) / 1000; // kg -> tons
    }
  }

  return {
    totalCO2: Number(totalCO2.toFixed(3)),
    avgPerVessel: Number(avgPerVessel.toFixed(3)),
    percentOffset,
    weeklyTrend: weeklyTrend.map(v => Number(v.toFixed(3))),
    labels,
  };
}

/**
 * Returns VesselStatus computed from /emissions (and simulated device data if needed)
 */
export async function fetchVesselStatus(): Promise<VesselStatus> {
  const emissions = (await safeFetchJson(`${API_BASE}/emissions/`)) ?? [];

  const uniqueDevices = Array.from(new Set(emissions.map((e: any) => e.device_id)));
  const activeVessels = uniqueDevices.length;

  // For now we don't have a canonical fleet registry -> idle = 0 (or you can set a constant fleet size)
  const idleVessels = 0;

  // utilizationRate: derive from average fuel amount vs an assumed max (2000 as used in simulation)
  const fuelAmounts = emissions.map((e: any) => Number(e?.fuel_amount) || 0);
  const avgFuel = fuelAmounts.length ? fuelAmounts.reduce((s: number, v: number) => s + v, 0) / fuelAmounts.length : 0;
  const MAX_FUEL = 2000; // same scale as your simulator
  const utilizationRate = Math.min(1, avgFuel / MAX_FUEL);

  // utilizationSeries: weekly utilization % based on weekly fuel totals vs (MAX_FUEL * activeVessels)
  const msPerDay = 24 * 60 * 60 * 1000;
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const labelDates: Date[] = [];
  for (let i = 6; i >= 0; i--) {
    labelDates.push(new Date(todayStart.getTime() - i * msPerDay));
  }
  const labels = labelDates.map(d => d.toLocaleDateString(undefined, { weekday: "short" }));
  const weeklyFuel = new Array<number>(7).fill(0);

  for (const e of emissions) {
    const ts = e?.timestamp;
    if (!ts) continue;
    const ed = new Date(ts);
    const edStart = new Date(ed.getFullYear(), ed.getMonth(), ed.getDate());
    const daysAgo = Math.round((todayStart.getTime() - edStart.getTime()) / msPerDay);
    if (daysAgo >= 0 && daysAgo <= 6) {
      const idx = 6 - daysAgo;
      weeklyFuel[idx] += Number(e?.fuel_amount) || 0;
    }
  }

  // If no active vessels, avoid divide-by-zero
  const denom = Math.max(1, activeVessels);
  const utilizationSeries = weeklyFuel.map(totalFuel => Math.min(1, totalFuel / (MAX_FUEL * denom)));

  return {
    activeVessels,
    idleVessels,
    utilizationRate: Number(utilizationRate.toFixed(3)),
    utilizationSeries: utilizationSeries.map(v => Number(v.toFixed(3))),
    labels,
  };
}