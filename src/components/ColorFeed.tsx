
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Video, Eye } from 'lucide-react';
import { io } from "socket.io-client";

const socket = io("http://192.168.137.183:5000");

type ColorFeedProps = {
  isColorDetection: boolean;
};

const ColorFeed: React.FC<ColorFeedProps> = ({ isColorDetection }) => {
  const [colorFeed, setColorFeed] = useState<string>("");

  useEffect(() => {
    socket.on("color_frame", (data) => {
      setColorFeed("data:image/jpeg;base64," + data?.image);
    });
  }, []);

  return (
    <div className="dashboard-panel h-full min-h-96 flex flex-col">
      <div className="panel-header">
        <Video className="h-5 w-5" />
        <span>Live Color Feed</span>
        {isColorDetection && (
          <div className="ml-auto flex items-center gap-2">
            <div className="h-3 w-3 bg-robotics-danger rounded-full animate-pulse" />
            <span className="text-sm text-robotics-danger">REC</span>
          </div>
        )}
      </div>

      <div className="video-container flex-grow relative">
        {/* Placeholder for actual video feed - in a real implementation this would be a video element or canvas */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img src={colorFeed} alt="" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default ColorFeed;
