import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { fetchMonthlyAnalytics } from "../store/dashboardSlice";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";
import { Calendar } from "lucide-react";

const MonthlyAnalytics: React.FC = () => {
  const dispatch = useDispatch();
  const { monthlyData, monthlyLoading, monthlyError } = useSelector(
    (state: RootState) => state.dashboard
  );
  const [chartType, setChartType] = useState<"line" | "bar">("bar");

  useEffect(() => {
    dispatch(fetchMonthlyAnalytics() as any);
  }, [dispatch]);

  if (monthlyLoading) {
    return (
      <div
        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl animate-fade-in flex items-center justify-center"
        style={{ animationDelay: "400ms" }}
      >
        <p className="text-white text-lg">Loading monthly analytics...</p>
      </div>
    );
  }

  if (monthlyError) {
    return (
      <div
        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl animate-fade-in flex items-center justify-center"
        style={{ animationDelay: "400ms" }}
      >
        <p className="text-red-400 text-lg">Error: {monthlyError}</p>
      </div>
    );
  }

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
      style={{ animationDelay: "400ms" }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Monthly Analysis</h2>
            <p className="text-gray-400 text-sm">
              Year overview of annotation performance
            </p>
          </div>
        </div>
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value as "line" | "bar")}
          className="bg-gray-700 text-white text-sm px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="line">Line Chart</option>
          <option value="bar">Bar Chart</option>
        </select>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart
              data={monthlyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="month"
                stroke="#9CA3AF"
                tickCount={monthlyData.length}
                interval={0}
                tick={{ fontSize: "12px" }}
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F9FAFB",
                }}
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
                dataKey="wrong"
                stroke="#EF4444"
                strokeWidth={2}
                name="Wrong Count"
              />
            </LineChart>
          ) : (
            <BarChart
              data={monthlyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="month"
                stroke="#9CA3AF"
                tickCount={monthlyData.length}
                interval={0}
                tick={{ fontSize: "12px" }}
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F9FAFB",
                }}
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
                dataKey="wrong"
                fill="#EF4444"
                name="Wrong Count"
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

export default MonthlyAnalytics;
