
import React, { useState, useEffect } from 'react';
import VideoFeed from '@/components/VideoFeed';
import ControlPanel from '@/components/ControlPanel';
import BatteryStatus from '@/components/BatteryStatus';
import EventLog from '@/components/EventLog';
import StatusIndicators from '@/components/StatusIndicators';
import { useToast } from '@/components/ui/use-toast';
import { Bot } from 'lucide-react';
import { io } from "socket.io-client";
import HeadControl from '@/components/HeadControl';
import ColorFeed from '@/components/ColorFeed';

const socket = io("http://192.168.137.183:5000");

const Index = () => {
  const { toast } = useToast();
  const [activeDirection, setActiveDirection] = useState<string | null>(null);
  const [isAutonomous, setIsAutonomous] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isCliffDetected, setIsCliffDetected] = useState(false);
  const [robotSpeed, setRobotSpeed] = useState(50);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('disconnected');
  const [voltage, setVoltage] = useState<number>(0)
  const [wifi, setWifi] = useState<number>(85)
  const [cpuUsage, setCpuUsage] = useState<number>(0)
  const [isLineFollow, setIsLineFollow] = useState<boolean>(false)
  const [activeHeadDirection, setActiveHeadDirection] = useState<string | "">();
  const [isColorDetection, setIsColorDetection] = useState<boolean>(false)


  useEffect(() => {
    socket.on("connect", () => {
      setConnectionStatus('connected')
      console.log("Connected to server")
    });
    socket.on("status", (data) => {
      console.log(data);
      setVoltage(data?.voltage);
      setWifi(data?.wifi ? 80 : 0)
      setCpuUsage(data?.cpu)
    } );

  }, []);

  const moveCar = (direction: string, speed:number) => {
     socket.emit("manual_control", { direction: direction, speed: speed });
  };

  const moveCarHead = (direction: string) => {
    socket.emit("head_control", { direction: direction });
  };

  const stopCar = () => {
    socket.emit("stop");
  }

  const on_line_follow = ()=> {
    setIsLineFollow(!isLineFollow)
    socket.emit("start_line_following");
  }

  const on_stop_line_follow = () => {
      setIsLineFollow(!isLineFollow);
      socket.emit("stop_line_following");
  }

  const onDetectColor = (color: string) => {
    setIsColorDetection(true)
    socket.emit("detect-color", {color: color});
  }

  const onStopDetectColor = () => {
    setIsColorDetection(false)
    socket.emit("close_color_detect");
  }

  // Simulate sending commands to the robot
  useEffect(() => {
    if (activeDirection) {
      console.log(`Sending command: ${activeDirection} at speed ${robotSpeed}%`);
    }
  }, [activeDirection, robotSpeed]);

  // Handle mode changes
  const handleToggleAutonomous = (enabled: boolean) => {
    setIsAutonomous(enabled);
    console.log(isAutonomous)
    socket.emit("stop_autonomous", { message: "Stop car" });
    setActiveDirection(null);
  }

    const handleToggleManual = (enabled: boolean) => {
      setIsAutonomous(enabled);
      console.log(isAutonomous)
      if (enabled) {
        socket.emit("start_autonomous");
        setActiveDirection(null);
      }

    toast({
      title: enabled ? "Autonomous Mode Enabled" : "Manual Control Enabled",
      description: enabled ? "Robot is now driving itself" : "You have full control of the robot",
    });
  };
  
  // Handle recording toggle
  const handleToggleRecording = (enabled: boolean) => {
    console.log(enabled)

    if (enabled) {
      setIsRecording(enabled);
      socket.emit("video-stream");
    } else {
      setIsRecording(!enabled)
      socket.emit("stop_stream");
    }

    toast({
      title: enabled ? "Recording Started" : "Recording Stopped",
      description: enabled 
        ? "Video is being saved to the robot's storage" 
        : "Video file has been saved successfully",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background pb-6">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-robotics-teal" />
            <h1 className="text-xl font-bold">RoboCar Control Panel</h1>
          </div>

          <div className="flex items-center gap-4">
            <StatusIndicators
              connectionStatus={connectionStatus}
              wifi={wifi}
              cpu={cpuUsage}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="flex-grow flex flex-col gap-6 lg:col-span-3">
              <EventLog
                onFollowLine={on_line_follow}
                onStopFollowLine={on_stop_line_follow}
                isLineFollow={isLineFollow}
                onDetectColor={onDetectColor}
                onStopDetectColor={onStopDetectColor}
              />

              <HeadControl
                onHeadDirectionChange={setActiveHeadDirection}
                moveCarHead={moveCarHead}
              />
            </div>
          </div>
          {/* Left Column - Video Feed */}
          <div className="lg:col-span-6 flex-grow">
            {!isColorDetection ? (
              <VideoFeed
                isCliffDetected={isCliffDetected}
                isRecording={isRecording}
                setIsRecording={setIsRecording}
              />
            ) : (
              <ColorFeed isColorDetection={isColorDetection} />
            )}
          </div>

          {/* Right Column - Control Panel, Battery Status, Event Log */}
          <div className="flex flex-col gap-6 lg:col-span-3">
            <ControlPanel
              onDirectionChange={setActiveDirection}
              onToggleAutonomous={handleToggleAutonomous}
              onToggleManual={handleToggleManual}
              onToggleRecording={handleToggleRecording}
              onSpeedChange={setRobotSpeed}
              isAutonomous={isAutonomous}
              isRecording={isRecording}
              onMoveCar={moveCar}
              onStopCar={stopCar}
            />

            <BatteryStatus batteryLevel={voltage} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
