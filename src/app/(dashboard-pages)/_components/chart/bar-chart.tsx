"use client";

import { useCallback, useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "~/components/ui/chart";
import { WithDependency } from "~/HOC/withDependencies";
import { AnalyticsService } from "~/services/analytics/analytics.service";
import { months } from "~/utils/constants";
import { dependencies } from "~/utils/dependencies";
import { SelectDropdown } from "../select-dropdown";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#6D5DD3",
  },
} satisfies ChartConfig;

export function Base_Bar_Chart({ analyticsService }: { analyticsService: AnalyticsService }) {
  const currentMonth = (new Date().getMonth() + 1).toString();
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const [filteredData, setFilteredData] = useState<{ day: number; revenue: number }[]>([]);

  const handleMonthChange = useCallback((value: string) => {
    setSelectedMonth(value);
  }, []);

  useEffect(() => {
    const fetchRevenueData = async () => {
      // Fetch revenue data for the selected month
      const response = await analyticsService.getDailyRevenueData(selectedMonth);
      if (response) {
        setFilteredData(response);
      }
    };
    // setSelectedMonth(new Date().getMonth().toString());
    fetchRevenueData();
  }, [analyticsService, selectedMonth]);

  return (
    <section className="rounded-[8px] border-default p-[24px]">
      <h5 className="text-h5 font-semibold text-high-grey-III">Revenue Overview</h5>
      <section className={`mb-8 mt-4 flex items-center justify-between gap-4`}>
        <SelectDropdown
          triggerClassName={`w-[100%]`}
          options={months}
          value={selectedMonth}
          placeholder={`Select month`}
          onValueChange={handleMonthChange}
        />
        <SelectDropdown
          disabled
          triggerClassName={`w-[100%] hidden lg:flex`}
          options={months}
          placeholder="product Type"
        />
        <SelectDropdown disabled triggerClassName={`w-[20rem] hidden lg:flex`} options={months} placeholder="Weeks" />
      </section>
      <ChartContainer config={chartConfig} className="h-[280px] w-full">
        <BarChart accessibilityLayer data={filteredData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </section>
  );
}

export const Bar_Chart = WithDependency(Base_Bar_Chart, {
  analyticsService: dependencies.ANALYTICS_SERVICE,
});
