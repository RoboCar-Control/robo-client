
import React, { useState, useEffect } from 'react';
import { Battery, BatteryCharging, BatteryFull, BatteryLow, BatteryMedium, BatteryWarning } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const BatteryStatus: React.FC = () => {
  // In a real implementation, this would be fetched from the robot
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [isCharging, setIsCharging] = useState(false);
  
  // Simulate battery drain
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel(prev => {
        // Random battery fluctuation
        const change = Math.random() > 0.7 ? -1 : (Math.random() > 0.9 ? 1 : 0);
        return Math.max(0, Math.min(100, prev + change));
      });
      
      // Randomly toggle charging state
      if (Math.random() > 0.95) {
        setIsCharging(prev => !prev);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getBatteryIcon = () => {
    if (isCharging) return <BatteryCharging className="h-5 w-5 text-robotics-blue" />;
    if (batteryLevel > 75) return <BatteryFull className="h-5 w-5 text-robotics-success" />;
    if (batteryLevel > 40) return <BatteryMedium className="h-5 w-5 text-robotics-blue" />;
    if (batteryLevel > 15) return <BatteryLow className="h-5 w-5 text-robotics-warning" />;
    return <BatteryWarning className="h-5 w-5 text-robotics-danger" />;
  };
  
  const getBatteryColor = () => {
    if (batteryLevel > 60) return 'bg-robotics-success';
    if (batteryLevel > 30) return 'bg-robotics-warning';
    return 'bg-robotics-danger';
  };
  
  return (
    <div className="dashboard-panel">
      <div className="panel-header">
        <Battery className="h-5 w-5" />
        <span>Battery Status</span>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          {getBatteryIcon()}
          <div className="flex-1">
            <Progress
              value={batteryLevel}
              className="h-2.5"
              // Use className with the cn utility to apply the battery color to the indicator
              className={cn(
                "h-2.5",
                "[&>div]:transition-all",
                `[&>div]:${getBatteryColor()}`
              )}
            />
          </div>
          <span className="text-sm font-medium w-12">{batteryLevel}%</span>
        </div>
        
        <div className="text-sm">
          {isCharging ? (
            <span className="text-robotics-success flex items-center gap-1">
              <BatteryCharging className="h-4 w-4" />
              Charging
            </span>
          ) : batteryLevel < 20 ? (
            <span className="text-robotics-danger">Low battery, connect charger</span>
          ) : (
            <span className="text-muted-foreground">
              Est. runtime: {Math.floor(batteryLevel / 10)} hours
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatteryStatus;
