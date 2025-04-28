
import React, { useState, useEffect, useRef } from 'react';
import { ClipboardList, Info, AlertTriangle, CheckCircle2, Play } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from './ui/button';

type LogEntry = {
  id: number;
  timestamp: Date;
  message: string;
  type: 'info' | 'warning' | 'success';
};

type EventProps = {
  onFollowLine: () => void;
  onStopFollowLine: () => void;
  isLineFollow: boolean;
  onDetectColor: (color:string) => void;
};

const EventLog: React.FC<EventProps> = ({
  onFollowLine,
  onStopFollowLine,
  isLineFollow,
  onDetectColor,
}) => {
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
      "Recording stopped",
    ];

    const warningMessages = [
      "Obstacle detected",
      "Cliff detected - stopping",
      "Low battery warning",
      "Weak connection signal",
      "High CPU temperature",
      "Camera frame rate reduced",
      "Object detection latency increased",
    ];

    const successMessages = [
      "Path completed successfully",
      "Object detected and avoided",
      "Cliff avoided",
      "Battery charging started",
      "System update completed",
      "Camera calibration successful",
      "Motor test passed",
    ];

    // Add initial log entries
    setLogs([
      {
        id: 1,
        timestamp: new Date(),
        message: "System initialized successfully",
        type: "success",
      },
      {
        id: 2,
        timestamp: new Date(),
        message: "Camera connected",
        type: "info",
      },
    ]);

    // Add a new log entry every few seconds
    const interval = setInterval(() => {
      const randomType = Math.random();
      let type: "info" | "warning" | "success";
      let message: string;

      if (randomType < 0.6) {
        type = "info";
        message = infoMessages[Math.floor(Math.random() * infoMessages.length)];
      } else if (randomType < 0.85) {
        type = "warning";
        message =
          warningMessages[Math.floor(Math.random() * warningMessages.length)];
      } else {
        type = "success";
        message =
          successMessages[Math.floor(Math.random() * successMessages.length)];
      }

      setLogs((prev) => [
        ...prev,
        {
          id: Date.now(),
          timestamp: new Date(),
          message,
          type,
        },
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
      case "info":
        return <Info className="h-4 w-4 text-robotics-blue" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-robotics-warning" />;
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-robotics-success" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="dashboard-panel h-full min-h-80 flex flex-col overflow-y-hidden">
      <div className="panel-header">
        <ClipboardList className="h-5 w-5" />
        <span>Event Controls</span>
      </div>

      {!isLineFollow ? (
        <Button
          variant="outline"
          className={`w-full `}
          onClick={() => onFollowLine()}
        >
          <>
            <Play className="h-5 w-5 mr-2" />
            <span>Start Line Follow</span>
          </>
        </Button>
      ) : (
        <Button
          variant="outline"
          className={`w-full bg-red-300`}
          onClick={() => onStopFollowLine()}
        >
          <>
            <Play className="h-5 w-5 mr-2" />
            <span>Stop Line Follow</span>
          </>
        </Button>
      )}

      <div className="mt-10 flex justify-between">
        <Button
          className="mt-2 p-5 flex justify-center bg-robotics-danger w-[70px] h-[70px] rounded-full"
          onClick={() => onDetectColor("#804F50")}
        >
          Red
        </Button>
        <Button
          className="mt-2 p-5 flex justify-center bg-blue-700 w-[70px] h-[70px] rounded-full"
          onClick={() => onDetectColor("#53A79E")}
        >
          Blue
        </Button>
        <Button
          className="mt-2 p-5 flex justify-center bg-green-500 w-[70px] h-[70px] rounded-full"
          onClick={() => onDetectColor("#74BB53")}
        >
          Green
        </Button>
      </div>
      <Button
        variant="outline"
        className={`w-full bg-white-500 mt-5`}
        onClick={() => onDetectColor("#ffffff")}
      >
        <>
          <Play className="h-5 w-5 mr-2" />
          <span>Detect White</span>
        </>
      </Button>
    </div>
  );
};

export default EventLog;
