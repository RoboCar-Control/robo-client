
import React, { useState, useEffect } from 'react';
import VideoFeed from '@/components/VideoFeed';
import ControlPanel from '@/components/ControlPanel';
import BatteryStatus from '@/components/BatteryStatus';
import EventLog from '@/components/EventLog';
import StatusIndicators from '@/components/StatusIndicators';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Bot, Settings, Info } from 'lucide-react';
import { io } from "socket.io-client";

const socket = io("http://l92.168.137.183:5000");

const Index = () => {
  const { toast } = useToast();
  const [activeDirection, setActiveDirection] = useState<string | null>(null);
  const [isAutonomous, setIsAutonomous] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isCliffDetected, setIsCliffDetected] = useState(false);
  const [robotSpeed, setRobotSpeed] = useState(50);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');
  const [voltage, setVoltage] = useState<number>(0)
  
  useEffect(() => {
    socket.on("connect", () => console.log("Connected to server"));
    socket.on("status", (data) => console.log(data));
  }, []);

  const moveCar = (direction: string, speed:number) => {
     socket.emit("manual_control", { direction: direction, speed: speed });
  };

  const stopCar = () => {
    socket.emit("stop");
  }

  // Simulate sending commands to the robot
  useEffect(() => {
    if (activeDirection) {
      console.log(`Sending command: ${activeDirection} at speed ${robotSpeed}%`);
      // In a real app, you would send this to your backend/WebSocket
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
    

    toast({
      title: enabled ? "Autonomous Mode Enabled" : "Manual Control Enabled",
      description: enabled ? "Robot is now driving itself" : "You have full control of the robot",
    });
    
    if (enabled) {
      socket.emit("start_autonomous");
      setActiveDirection(null);
    } else {
      socket.emit("stop_autonomous");
    }
  };
  
  // Handle recording toggle
  const handleToggleRecording = (enabled: boolean) => {
    setIsRecording(enabled);
    
    if (enabled) {
      socket.emit("video-stream");
    } else {
      socket.emit("stop_recording");
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
            <StatusIndicators connectionStatus={connectionStatus} />

            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Info className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="flex-grow">
              <EventLog />
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

            <BatteryStatus batteryLevel={voltage}/>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
