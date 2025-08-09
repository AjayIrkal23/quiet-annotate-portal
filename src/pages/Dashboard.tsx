import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { fetchSummaryMetrics } from "../store/dashboardSlice";
import StatusCard from "../components/StatusCard";
import AnalyticsChart from "../components/AnalyticsChart";
import MonthlyAnalytics from "../components/MonthlyAnalytics";
import CurrentMonthAnalytics from "../components/CurrentMonthAnalytics";
import { Image, AlertCircle, Users, CheckCircle, XCircle } from "lucide-react";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const {
    imagesUploaded,
    violationsFound,
    usersAnnotated,
    totalValid,
    totalInvalid,
    summaryLoading,
    summaryError,
  } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(fetchSummaryMetrics() as any);
  }, [dispatch]);

  if (summaryLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-0 flex items-center justify-center">
        <div className="animate-pulse text-white text-lg flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full animate-bounce"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (summaryError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center">
        <div className="text-red-400 text-lg flex items-center space-x-2">
          <AlertCircle className="w-6 h-6" />
          <p>Error: {summaryError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      {/* Header Section */}
      <div className="mb-4  p-4 animate-fade-in">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Image className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent text-3xl">
            Analytics Dashboard
          </h1>
        </div>
        <p className="text-gray-400 font-medium text-sm max-w-md">
          Real-time insights and performance metrics for your annotation
          workflow
        </p>
      </div>

      {/* Status Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        <StatusCard
          title="Images Uploaded"
          value={imagesUploaded}
          icon={Image}
          delay={0}
          trendUp={true}
        />
        <StatusCard
          title="Violations Found"
          value={violationsFound}
          icon={AlertCircle}
          delay={100}
          trendUp={true}
        />
        <StatusCard
          title="Users Annotated"
          value={usersAnnotated}
          icon={Users}
          delay={200}
          trendUp={true}
        />
        <StatusCard
          title="Total Valid"
          value={totalValid}
          icon={CheckCircle}
          delay={300}
          trendUp={true}
        />
        <StatusCard
          title="Total Invalid"
          value={totalInvalid}
          icon={XCircle}
          delay={400}
          trendUp={false}
        />
      </div>

      <div className="grid grid-cols-1   mb-8">
        <CurrentMonthAnalytics />
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AnalyticsChart />
        <MonthlyAnalytics />
      </div>
    </div>
  );
};

export default Dashboard;
