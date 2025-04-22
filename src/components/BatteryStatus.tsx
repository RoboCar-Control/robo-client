
import React, { useState, useEffect } from 'react';
import { Battery, BatteryCharging, BatteryFull, BatteryLow, BatteryMedium, BatteryWarning } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type BatteryProps = {
  batteryLevel: number;
}
const BatteryStatus: React.FC<BatteryProps> = ({batteryLevel}) => {
  const [voltagePercent, setVoltagePercent] = useState(85)
  
  useEffect(() => {
    const initialPercent = Math.round((batteryLevel / 4095) * 100);
    console.log(batteryLevel)
    console.log(initialPercent)
    setVoltagePercent(initialPercent);

    const interval = setInterval(() => {
      setVoltagePercent((prev) => {
        // Random battery fluctuation
        const change = Math.random() > 0.7 ? -1 : Math.random() > 0.9 ? 1 : 0;
        return Math.max(0, Math.min(100, prev + change));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  console.log(batteryLevel)
  console.log(voltagePercent);
  const getBatteryIcon = () => {
    // if (isCharging) return <BatteryCharging className="h-5 w-5 text-robotics-blue" />;
    if (voltagePercent > 75) return <BatteryFull className="h-5 w-5 text-robotics-success" />;
    if (voltagePercent > 40) return <BatteryMedium className="h-5 w-5 text-robotics-blue" />;
    if (voltagePercent > 15) return <BatteryLow className="h-5 w-5 text-robotics-warning" />;
    return <BatteryWarning className="h-5 w-5 text-robotics-danger" />;
  };
  
  const getBatteryColor = () => {
    if (voltagePercent > 60) return 'bg-robotics-success';
    if (voltagePercent > 30) return 'bg-robotics-warning';
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
              value={voltagePercent}
              className="h-2.5"
              // Use className with the cn utility to apply the battery color to the indicator
              className={cn(
                "h-2.5",
                "[&>div]:transition-all",
                `[&>div]:${getBatteryColor()}`
              )}
            />
          </div>
          <span className="text-sm font-medium w-12">{voltagePercent}%</span>
        </div>
        
        {/* <div className="text-sm">
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
        </div> */}
      </div>
    </div>
  );
};

export default BatteryStatus;
