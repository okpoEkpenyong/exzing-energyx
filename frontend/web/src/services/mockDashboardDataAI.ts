// mockDashboardData.ts

export interface DashboardData {
    id: number;
    title: string;
    value: number | string;
    unit?: string;
}

export const mockDashboardData: DashboardData[] = [
    {
        id: 1,
        title: "Total Energy Consumption",
        value: 1250,
        unit: "kWh",
    },
    {
        id: 2,
        title: "Peak Demand",
        value: 300,
        unit: "kW",
    },
    {
        id: 3,
        title: "Carbon Emissions",
        value: "2.5",
        unit: "tons",
    },
    {
        id: 4,
        title: "Renewable Energy Usage",
        value: "45%",
    },
    {
        id: 5,
        title: "Operational Efficiency",
        value: "89%",
    },
];

export const getMockDashboardData = (): DashboardData[] => {
    return mockDashboardData;
};