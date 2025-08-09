import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { fetchCurrentMonthAnalytics } from "../store/dashboardSlice";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";
import { Calendar } from "lucide-react";
import { format, parse } from "date-fns";

const CurrentMonthAnalytics: React.FC = () => {
  const dispatch = useDispatch();
  const {
    currentMonthData,
    currentMonthLoading,
    currentMonthError,
  } = useSelector((state: RootState) => state.dashboard);
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  useEffect(() => {
    dispatch(fetchCurrentMonthAnalytics() as any);
  }, [dispatch]);

  if (currentMonthLoading) {
    return (
      <div
        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl animate-fade-in flex items-center justify-center"
        style={{ animationDelay: "500ms" }}
      >
        <p className="text-white text-lg">Loading current month analytics...</p>
      </div>
    );
  }

  if (currentMonthError) {
    return (
      <div
        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl animate-fade-in flex items-center justify-center"
        style={{ animationDelay: "500ms" }}
      >
        <p className="text-red-400 text-lg">Error: {currentMonthError}</p>
      </div>
    );
  }

  // Format date as "MMM DD" (e.g., "Aug 01") for tooltip
  const formatDate = (dateStr: string) => {
    const date = parse(dateStr, "yyyy-MM-dd", new Date());
    return format(date, "MMM dd");
  };

  // Custom tick component for two-line date (e.g., "Aug\n09")
  const CustomTick = ({ x, y, payload }: any) => {
    const date = parse(payload.value, "yyyy-MM-dd", new Date());
    const month = format(date, "MMM");
    const day = format(date, "dd");
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={5}
          textAnchor="middle"
          fill="#9CA3AF"
          fontSize="10px"
        >
          {month}
        </text>
        <text
          x={0}
          y={12}
          dy={5}
          textAnchor="middle"
          fill="#9CA3AF"
          fontSize="10px"
        >
          {day}
        </text>
      </g>
    );
  };

  // Custom label render function to hide zero values
  const renderCustomLabel = ({ x, y, width, height, value }: any) => {
    if (value === 0) return null;
    return (
      <text
        x={x + width / 2}
        y={y + height / 2}
        fill="#FFFFFF"
        fontSize="10px"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {value}
      </text>
    );
  };

  return (
    <div
      className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl animate-fade-in"
      style={{ animationDelay: "500ms" }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-green-500 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Current Month Analytics
            </h2>
            <p className="text-gray-400 text-sm">
              Daily annotation performance for August 2025
            </p>
          </div>
        </div>
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value as "line" | "bar")}
          className="bg-gray-700 text-white text-sm px-4 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="line">Line Chart</option>
          <option value="bar">Bar Chart</option>
        </select>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart data={currentMonthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                tickCount={currentMonthData.length}
                interval={0}
                tick={<CustomTick />}
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F9FAFB",
                }}
                labelFormatter={formatDate}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="annotated"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Annotated Images"
              />
              <Line
                type="monotone"
                dataKey="valid"
                stroke="#10B981"
                strokeWidth={2}
                name="Valid Count"
              />
              <Line
                type="monotone"
                dataKey="invalid"
                stroke="#EF4444"
                strokeWidth={2}
                name="Invalid Count"
              />
            </LineChart>
          ) : (
            <BarChart data={currentMonthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                tickCount={currentMonthData.length}
                interval={0}
                tick={<CustomTick />}
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F9FAFB",
                }}
                labelFormatter={formatDate}
              />
              <Legend />
              <Bar
                dataKey="annotated"
                fill="#3B82F6"
                name="Annotated Images"
                stackId="a"
              >
                <LabelList content={renderCustomLabel} />
              </Bar>
              <Bar
                dataKey="valid"
                fill="#10B981"
                name="Valid Count"
                stackId="a"
              >
                <LabelList content={renderCustomLabel} />
              </Bar>
              <Bar
                dataKey="invalid"
                fill="#EF4444"
                name="Invalid Count"
                stackId="a"
              >
                <LabelList content={renderCustomLabel} />
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CurrentMonthAnalytics;
