
import React, { useState, useEffect, useRef } from 'react';
import { ClipboardList, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

type LogEntry = {
  id: number;
  timestamp: Date;
  message: string;
  type: 'info' | 'warning' | 'success';
};

const EventLog: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Generate simulated log entries
  useEffect(() => {
    const infoMessages = [
      "System initialized",
      "Camera connected",
      "Streaming video feed",
      "Object detection running",
      "Line tracking active",
      "Moving forward",
      "Turning left",
      "Turning right",
      "Moving backward",
      "Stopped",
      "Speed changed to 50%",
      "Autonomous mode enabled",
      "Manual mode enabled",
      "Recording started",
      "Recording stopped"
    ];
    
    const warningMessages = [
      "Obstacle detected",
      "Cliff detected - stopping",
      "Low battery warning",
      "Weak connection signal",
      "High CPU temperature",
      "Camera frame rate reduced",
      "Object detection latency increased"
    ];
    
    const successMessages = [
      "Path completed successfully",
      "Object detected and avoided",
      "Cliff avoided",
      "Battery charging started",
      "System update completed",
      "Camera calibration successful",
      "Motor test passed"
    ];
    
    // Add initial log entries
    setLogs([
      {
        id: 1,
        timestamp: new Date(),
        message: "System initialized successfully",
        type: "success"
      },
      {
        id: 2,
        timestamp: new Date(),
        message: "Camera connected",
        type: "info"
      }
    ]);
    
    // Add a new log entry every few seconds
    const interval = setInterval(() => {
      const randomType = Math.random();
      let type: 'info' | 'warning' | 'success';
      let message: string;
      
      if (randomType < 0.6) {
        type = 'info';
        message = infoMessages[Math.floor(Math.random() * infoMessages.length)];
      } else if (randomType < 0.85) {
        type = 'warning';
        message = warningMessages[Math.floor(Math.random() * warningMessages.length)];
      } else {
        type = 'success';
        message = successMessages[Math.floor(Math.random() * successMessages.length)];
      }
      
      setLogs(prev => [
        ...prev,
        {
          id: Date.now(),
          timestamp: new Date(),
          message,
          type
        }
      ]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [logs]);
  
  const getLogIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-4 w-4 text-robotics-blue" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-robotics-warning" />;
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-robotics-success" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="dashboard-panel h-full min-h-80 flex flex-col overflow-y-hidden">
      <div className="panel-header">
        <ClipboardList className="h-5 w-5" />
        <span>Event Log</span>
      </div>
      
      {/* <ScrollArea className="flex-grow" ref={scrollAreaRef}>
        <div className="space-y-2 pr-2">
          {logs.map(log => (
            <div 
              key={log.id} 
              className={`p-2 rounded text-sm border-l-4 bg-secondary/30 flex items-start gap-2 
                ${log.type === 'info' ? 'border-robotics-blue' : ''} 
                ${log.type === 'warning' ? 'border-robotics-warning' : ''} 
                ${log.type === 'success' ? 'border-robotics-success' : ''}`}
            >
              {getLogIcon(log.type)}
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground">
                  {log.timestamp.toLocaleTimeString()}
                </div>
                <div className="font-medium break-words">
                  {log.message}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea> */}
    </div>
  );
};

export default EventLog;
