import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { User, Trophy, CheckCircle, XCircle, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { fetchAllValidatedImages } from "@/store/thunks/fetchAllValidatedImages";
import ImageCard from "@/components/ImageCardProfile";

const UserProfile = () => {
  const { profile, validatedImagesCorrect, validatedImagesWrong } = useSelector(
    (state: RootState) => state.user
  );

  console.log(validatedImagesCorrect);

  const dispatch = useDispatch();

  useEffect(() => {
    // Replace with dynamic employee ID if available in auth/profile
    dispatch<any>(fetchAllValidatedImages({ employeeId: "AjayIrkal" }));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent text-2xl">
            User Profile
          </h1>
        </div>
        <p className="text-gray-400 font-medium text-sm">
          Your validation performance and statistics
        </p>
      </div>

      {/* Profile Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{profile.name}</h3>
              <p className="text-gray-400 text-sm">ID: {profile.employeeId}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Images Validated</span>
            <Eye className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            {profile.imagesValidated}
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Validated Correct</span>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-400">
            {profile.validatedCorrect}
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Validated Wrong</span>
            <XCircle className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-400">
            {profile.validatedWrong}
          </p>
        </div>
      </div>

      {/* Leaderboard Position */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Leaderboard Position
            </h3>
            <p className="text-3xl font-bold text-yellow-400">
              #{profile.leaderboardPosition}
            </p>
            <p className="text-gray-400 text-sm">Out of all validators</p>
          </div>
        </div>
      </div>

      {/* Validated Images Tabs */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <Tabs defaultValue="correct" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-700">
            <TabsTrigger
              value="correct"
              className="data-[state=active]:bg-green-600"
            >
              Validated Correct ({validatedImagesCorrect.length})
            </TabsTrigger>
            <TabsTrigger
              value="wrong"
              className="data-[state=active]:bg-red-600"
            >
              Validated Wrong ({validatedImagesWrong.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="correct" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {validatedImagesCorrect.map((image, index) => (
                <ImageCard key={index} image={image} isCorrect={true} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="wrong" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {validatedImagesWrong.map((image, index) => (
                <ImageCard key={index} image={image} isCorrect={false} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
