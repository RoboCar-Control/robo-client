
import React, { useState } from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Square, 
  Play, 
  Pause,
  ToggleLeft,
  ToggleRight,
  Gamepad2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { io } from "socket.io-client";

const socket = io("http://192.168.137.183:5000");

type ControlPanelProps = {
  onDirectionChange: (direction: string | null) => void;
  onToggleAutonomous: (enabled: boolean) => void;
  onToggleManual: (Enabled: boolean) => void;
  onToggleRecording: (enabled: boolean) => void;
  onSpeedChange: (speed: number) => void;
  onMoveCar: (direction: string, speed: number) => void;
  onStopCar: () => void;
  onStopRecording: (enable: boolean) => void
  isAutonomous: boolean;
  isRecording: boolean;
};

const ControlPanel: React.FC<ControlPanelProps> = ({
  onDirectionChange,
  onToggleAutonomous,
  onToggleManual,
  onToggleRecording,
  onStopRecording,
  onSpeedChange,
  isAutonomous,
  isRecording,
  onMoveCar,
  onStopCar
}) => {
  const [activeDirection, setActiveDirection] = useState<string | null>(null);
  const [speed, setSpeed] = useState(50);

  const handleDirectionPress = (direction: string, speed:number) => {
    if (isAutonomous) return;
    onMoveCar(direction, speed)
    setActiveDirection(direction);
    onDirectionChange(direction);
  };

  const handleDirectionRelease = () => {
    if (isAutonomous) return;

    setActiveDirection(null);
    onDirectionChange(null);
  };

  const handleSpeedChange = (value: number[]) => {
    const newSpeed = value[0];
    setSpeed(newSpeed);
    onSpeedChange(newSpeed);
    socket.emit("increase_speed", { speed: newSpeed });
  };

  return (
    <div className="dashboard-panel h-full flex flex-col">
      <div className="panel-header">
        <Gamepad2 className="h-5 w-5" />
        <span>Control Panel</span>
      </div>

      <div className="flex flex-col gap-6">
        {/* Mode Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Control Mode:</span>
          {isAutonomous ? (
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => onToggleAutonomous(!isAutonomous)}
            >
              <ToggleRight className="h-5 w-5 text-robotics-success" />
              <span>Autonomous</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => onToggleManual(!isAutonomous)}
            >
              <ToggleLeft className="h-5 w-5" />
              <span>Manual</span>
            </Button>
          )}
        </div>

        {/* Speed Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Speed: {speed}%</span>
          </div>
          <Slider
            value={[speed]}
            min={0}
            max={100}
            step={1}
            onValueChange={handleSpeedChange}
            className="h-2"
          />
        </div>

        {/* Direction Controls */}
        <div
          className={`grid grid-cols-3 gap-2 ${
            isAutonomous ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <div className="col-start-2">
            <button
              className={`control-button ${
                activeDirection === "forward" ? "control-button-active" : ""
              }`}
              onMouseDown={() => handleDirectionPress("forward", 80)}
              onMouseUp={handleDirectionRelease}
              onMouseLeave={handleDirectionRelease}
              onTouchStart={() => handleDirectionPress("forward", 80)}
              onTouchEnd={handleDirectionRelease}
              disabled={isAutonomous}
            >
              <ArrowUp className="h-6 w-6" />
            </button>
          </div>
          <div className="col-start-1 row-start-2">
            <button
              className={`control-button ${
                activeDirection === "left" ? "control-button-active" : ""
              }`}
              onMouseDown={() => handleDirectionPress("left", 50)}
              onMouseUp={handleDirectionRelease}
              onMouseLeave={handleDirectionRelease}
              onTouchStart={() => handleDirectionPress("left", 50)}
              onTouchEnd={handleDirectionRelease}
              disabled={isAutonomous}
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
          </div>
          <div className="col-start-2 row-start-2">
            <button
              className={`control-button ${
                activeDirection === "stop" ? "control-button-active" : ""
              }`}
              onMouseDown={() => handleDirectionPress("stop", 0)}
              onMouseUp={handleDirectionRelease}
              onMouseLeave={handleDirectionRelease}
              onTouchStart={() => handleDirectionPress("stop", 0)}
              onTouchEnd={handleDirectionRelease}
              onClick={() => onStopCar()}
              disabled={isAutonomous}
            >
              <Square className="h-6 w-6" />
            </button>
          </div>
          <div className="col-start-3 row-start-2">
            <button
              className={`control-button ${
                activeDirection === "right" ? "control-button-active" : ""
              }`}
              onMouseDown={() => handleDirectionPress("right", 80)}
              onMouseUp={handleDirectionRelease}
              onMouseLeave={handleDirectionRelease}
              onTouchStart={() => handleDirectionPress("right", 80)}
              onTouchEnd={handleDirectionRelease}
              disabled={isAutonomous}
            >
              <ArrowRight className="h-6 w-6" />
            </button>
          </div>
          <div className="col-start-2 row-start-3">
            <button
              className={`control-button ${
                activeDirection === "backward" ? "control-button-active" : ""
              }`}
              onMouseDown={() => handleDirectionPress("backward", 80)}
              onMouseUp={handleDirectionRelease}
              onMouseLeave={handleDirectionRelease}
              onTouchStart={() => handleDirectionPress("backward", 80)}
              onTouchEnd={handleDirectionRelease}
              disabled={isAutonomous}
            >
              <ArrowDown className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Recording Control */}
        <div className="mt-auto">
          {isRecording ? (
            <Button
              variant="outline"
              className={`w-full bg-robotics-danger text-white hover:bg-robotics-danger/80`}
              onClick={() => onStopRecording(false)}
            >
              <>
                <Pause className="h-5 w-5 mr-2" />
                <span>Stop Detection</span>
              </>
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => onToggleRecording(!isRecording)}
              className="w-full "
            >
              <>
                <Play className="h-5 w-5 mr-2" />
                <span>Start Object Detection</span>
              </>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;


//  "tunnel": "lt --port 5173",
//   "dev:share": "concurrently \"npm run dev\" \"npm run tunnel\"",