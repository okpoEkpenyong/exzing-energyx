// src/services/mockDashboardData.ts

export interface CarbonMetrics {
    totalCO2: number; // in tons
    avgPerVessel: number;
    percentOffset: number; // 0 to 1
  }
  
  export interface VesselStatus {
    activeVessels: number;
    idleVessels: number;
    utilizationRate: number; // 0 to 1
  }
  
  export const fetchCarbonMetrics = async (): Promise<CarbonMetrics> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
    return {
      totalCO2: 2560,
      avgPerVessel: 213,
      percentOffset: 0.42
    };
  };
  
  export const fetchVesselStatus = async (): Promise<VesselStatus> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
    return {
      activeVessels: 19,
      idleVessels: 2,
      utilizationRate: 0.90
    };
  };
  