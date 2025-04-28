
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Video, Eye } from 'lucide-react';
import { io } from "socket.io-client";

const socket = io("http://192.168.137.183:5000");

type Detection = {
  id: number;
  label: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

type VideoFeedProps = {
  isCliffDetected: boolean;
  isRecording: boolean;
  setIsRecording: (data) => void;
};

const VideoFeed: React.FC<VideoFeedProps> = ({
  isCliffDetected,
  isRecording,
  setIsRecording,
}) => {
  // In a real application, these would come from a WebSocket or API
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isLineTracking, setIsLineTracking] = useState(false);
  const [videoFeed, setVideoFeed] = useState<string>("");
  const [colorFeed, setColorFeed] = useState<string>("");

  useEffect(() => {
    socket.on("video-stream", () => console.log("Connected to server"));
    socket.on("video_frame", (data) => {
      setVideoFeed("data:image/jpeg;base64," + data?.image);
    });
  }, []);

  // Simulate object detections for demonstration
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newDetections: Detection[] = [];
        const numDetections = Math.floor(Math.random() * 3) + 1;

        for (let i = 0; i < numDetections; i++) {
          const labels = ["Person", "Chair", "Table", "Dog", "Cat", "Car"];
          newDetections.push({
            id: i,
            label: labels[Math.floor(Math.random() * labels.length)],
            confidence: Math.round(Math.random() * 100) / 100,
            x: Math.random() * 60 + 10,
            y: Math.random() * 60 + 10,
            width: Math.random() * 30 + 10,
            height: Math.random() * 30 + 10,
          });
        }

        setDetections(newDetections);
      } else {
        setDetections([]);
      }

      // Randomly toggle line tracking
      setIsLineTracking(Math.random() > 0.5);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-panel h-full min-h-96 flex flex-col">
      <div className="panel-header">
        <Video className="h-5 w-5" />
        <span>Live Video Feed</span>
        {isRecording && (
          <div className="ml-auto flex items-center gap-2">
            <div className="h-3 w-3 bg-robotics-danger rounded-full animate-pulse" />
            <span className="text-sm text-robotics-danger">REC</span>
          </div>
        )}
      </div>

      {/* {isCliffDetected && (
        <div className="alert-banner">
          <AlertTriangle className="h-5 w-5" />
          <span>CLIFF DETECTED - Robot stopped for safety</span>
        </div>
      )} */}

      <div className="video-container flex-grow relative">
        {/* Placeholder for actual video feed - in a real implementation this would be a video element or canvas */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* src="https://picsum.photos/seed/picsum/500/600" */}
          {isRecording ? (
            <img
              src={colorFeed}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <p className="text-muted-foreground flex items-center gap-2">
              <Eye className="h-5 w-5" />
              <span>Live video stream would appear here</span>
            </p>
          )}
        </div>

        {/* Line tracking visualization */}
        {/* {isLineTracking && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-robotics-teal/70 h-1 w-3/4 rounded-full" />
        )} */}
      </div>
    </div>
  );
};

export default VideoFeed;
