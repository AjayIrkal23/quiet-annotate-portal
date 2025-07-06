
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { User, Trophy, CheckCircle, XCircle, Eye, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const UserProfile = () => {
  const { profile, validatedImagesCorrect, validatedImagesWrong } = useSelector(
    (state: RootState) => state.user
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const ImageCard = ({ image, isCorrect }: { image: any; isCorrect: boolean }) => (
    <div className="group relative">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden hover:border-gray-600/50 transition-all duration-300">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={image.imagePath}
            alt={image.imageName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          <div className={`absolute top-2 right-2 ${isCorrect ? 'bg-green-500' : 'bg-red-500'} text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1`}>
            {isCorrect ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
            <span>{image.violationDetails.length}</span>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <button className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                  <Eye className="w-6 h-6 text-white" />
                </div>
              </button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white text-lg">{image.imageName}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="aspect-video overflow-hidden rounded-lg">
                  <img
                    src={image.imagePath}
                    alt={image.imageName}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-white">Validation Results</h4>
                  {image.violationDetails.map((violation: any, index: number) => (
                    <div key={index} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
                      <div className="flex items-start space-x-3">
                        <div className="flex items-center space-x-2 mt-1">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: getSeverityColor(violation.severity) }} 
                          />
                          {violation.isValid ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-white mb-1">{violation.name}</h5>
                          <p className="text-gray-300 text-sm mb-2">{violation.description}</p>
                          <div className="flex items-center space-x-2">
                            <span 
                              className="text-xs font-medium px-2 py-1 rounded-full"
                              style={{ 
                                backgroundColor: `${getSeverityColor(violation.severity)}20`,
                                color: getSeverityColor(violation.severity)
                              }}
                            >
                              {violation.severity.toUpperCase()}
                            </span>
                            <span 
                              className={`text-xs font-medium px-2 py-1 rounded-full ${
                                violation.isValid 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-red-500/20 text-red-400'
                              }`}
                            >
                              {violation.isValid ? 'VALID' : 'INVALID'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="p-4">
          <h3 className="text-white font-medium text-sm truncate mb-2">{image.imageName}</h3>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>ID: {image.employeeId}</span>
            <span className="flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3" />
              <span>{image.violationDetails.length} violations</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );

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
          <p className="text-2xl font-bold text-white">{profile.imagesValidated}</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Validated Correct</span>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-400">{profile.validatedCorrect}</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Validated Wrong</span>
            <XCircle className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-400">{profile.validatedWrong}</p>
        </div>
      </div>

      {/* Leaderboard Position */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Leaderboard Position</h3>
            <p className="text-3xl font-bold text-yellow-400">#{profile.leaderboardPosition}</p>
            <p className="text-gray-400 text-sm">Out of all validators</p>
          </div>
        </div>
      </div>

      {/* Validated Images Tabs */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
        <Tabs defaultValue="correct" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-700">
            <TabsTrigger value="correct" className="data-[state=active]:bg-green-600">
              Validated Correct ({validatedImagesCorrect.length})
            </TabsTrigger>
            <TabsTrigger value="wrong" className="data-[state=active]:bg-red-600">
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
