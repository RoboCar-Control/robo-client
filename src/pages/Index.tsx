
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

const socket = io("http://localhost:5000");

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
  const [activeHeadDirection, setActiveHeadDirection] = useState<string | null>('')


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

  // Simulate sending commands to the robot
  useEffect(() => {
    if (activeDirection) {
      console.log(`Sending command: ${activeDirection} at speed ${robotSpeed}%`);
    }
  }, [activeDirection, robotSpeed]);
  
  // Simulate cliff detection randomly
  useEffect(() => {
    const interval = setInterval(() => {
      const shouldDetectCliff = Math.random() > 0.9;
      
      if (shouldDetectCliff && !isCliffDetected) {
        setIsCliffDetected(true);
        toast({
          title: "Cliff Detected!",
          description: "Robot has stopped for safety",
          variant: "destructive",
        });
        
        // Auto-clear after a few seconds
        setTimeout(() => {
          setIsCliffDetected(false);
        }, 5000);
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [isCliffDetected, toast]);
  
  // Handle mode changes
  const handleToggleAutonomous = (enabled: boolean) => {
    setIsAutonomous(enabled);
    console.log(isAutonomous)
    if (enabled) {
      socket.emit("start_autonomous");
      setActiveDirection(null);
    } else {
      socket.emit("stop_autonomous");
    }

    toast({
      title: enabled ? "Autonomous Mode Enabled" : "Manual Control Enabled",
      description: enabled ? "Robot is now driving itself" : "You have full control of the robot",
    });
  };
  
  // Handle recording toggle
  const handleToggleRecording = (enabled: boolean) => {
    setIsRecording(enabled);
    
    if (enabled) {
      socket.emit("video-stream");
    } else {
      socket.emit("stop_stream", {"state": true});
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

            {/* <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Info className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div> */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="flex-grow flex flex-col gap-6 lg:col-span-3">
              <EventLog />

              <HeadControl
                onHeadDirectionChange={setActiveHeadDirection}
                moveCarHead={moveCarHead}
              />
            </div>
          </div>
          {/* Left Column - Video Feed */}
          <div className="lg:col-span-6 flex-grow">
            <VideoFeed
              isCliffDetected={isCliffDetected}
              isRecording={isRecording}
            />
          </div>

          {/* Right Column - Control Panel, Battery Status, Event Log */}
          <div className="flex flex-col gap-6 lg:col-span-3">
            <ControlPanel
              onDirectionChange={setActiveDirection}
              onToggleAutonomous={handleToggleAutonomous}
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
