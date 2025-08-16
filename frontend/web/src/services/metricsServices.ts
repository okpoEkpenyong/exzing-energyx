// frontend/web/src/services/metricsService.ts
export type DashboardMetrics = {
    totalCO2: number;
    avgPerVessel: number;
    percentOffset: number;
    weeklyTrend: number[]; // tons
    labels: string[];
    activeVessels: number;
    utilizationRate: number;
  };
  
  console.log("All env URL:", import.meta.env);

  const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "https://exzing-energyx.onrender.com";

  // const API_BASE = (import.meta.env.VITE_API_BASE_URL as string);
  // const API_BASE = import.meta.env.VITE_API_BASE_URL;
  // const API_BASE = "https://exzing-energyx.onrender.com/";
  // console.log('API URL:', API_BASE);
  // console.log("Env URL:", `${import.meta.env.VITE_API_BASE_URL}`);

  // export async function getMetrics() {
  //   const url = `${import.meta.env.VITE_API_BASE_URL}/metrics/dashboard`;
  //   const res = await fetch(url);
  //   return res.json();
  // }
  
  
  export async function fetchDashboardMetrics(): Promise<DashboardMetrics | null> {
    try {
      const res = await fetch(`${API_BASE}/metrics/dashboard`);
      
      if (!res.ok) {
        console.warn("metrics/dashboard failed", res.status);
        return null;
      }
      const j = await res.json();
      console.log({dashboard_res: res, dashboard_json: j});
      // Ensure arrays exist even if backend omitted them
      return {
        totalCO2: j.totalCO2 ?? 0,
        avgPerVessel: j.avgPerVessel ?? 0,
        percentOffset: j.percentOffset ?? 0,
        weeklyTrend: Array.isArray(j.weeklyTrend) ? j.weeklyTrend : [],
        labels: Array.isArray(j.labels) ? j.labels : [],
        activeVessels: j.activeVessels ?? 0,
        utilizationRate: j.utilizationRate ?? 0,
      };
    } catch (err) {
      console.error("fetchDashboardMetrics error", err);
      return null;
    }
  }
  