
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

type ControlPanelProps = {
  onDirectionChange: (direction: string | null) => void;
  onToggleAutonomous: (enabled: boolean) => void;
  onToggleRecording: (enabled: boolean) => void;
  onSpeedChange: (speed: number) => void;
  onMoveCar: (direction: string) => void;
  onStopCar:() => void;
  isAutonomous: boolean;
  isRecording: boolean;
};

const ControlPanel: React.FC<ControlPanelProps> = ({
  onDirectionChange,
  onToggleAutonomous,
  onToggleRecording,
  onSpeedChange,
  isAutonomous,
  isRecording,
  onMoveCar,
  onStopCar
}) => {
  const [activeDirection, setActiveDirection] = useState<string | null>(null);
  const [speed, setSpeed] = useState(50);

  const handleDirectionPress = (direction: string) => {
    if (isAutonomous) return;

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
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => onToggleAutonomous(!isAutonomous)}
          >
            {isAutonomous ? (
              <>
                <ToggleRight className="h-5 w-5 text-robotics-success" />
                <span>Autonomous</span>
              </>
            ) : (
              <>
                <ToggleLeft className="h-5 w-5" />
                <span>Manual</span>
              </>
            )}
          </Button>
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
              onMouseDown={() => handleDirectionPress("forward")}
              onMouseUp={handleDirectionRelease}
              onMouseLeave={handleDirectionRelease}
              onTouchStart={() => handleDirectionPress("forward")}
              onClick={() => onMoveCar("forward")}
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
              onMouseDown={() => handleDirectionPress("left")}
              onMouseUp={handleDirectionRelease}
              onMouseLeave={handleDirectionRelease}
              onTouchStart={() => handleDirectionPress("left")}
              onTouchEnd={handleDirectionRelease}
              onClick={() => onMoveCar("left")}
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
              onMouseDown={() => handleDirectionPress("stop")}
              onMouseUp={handleDirectionRelease}
              onMouseLeave={handleDirectionRelease}
              onTouchStart={() => handleDirectionPress("stop")}
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
              onMouseDown={() => handleDirectionPress("right")}
              onMouseUp={handleDirectionRelease}
              onMouseLeave={handleDirectionRelease}
              onTouchStart={() => handleDirectionPress("right")}
              onClick={() => onMoveCar("right")}
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
              onMouseDown={() => handleDirectionPress("backward")}
              onMouseUp={handleDirectionRelease}
              onMouseLeave={handleDirectionRelease}
              onTouchStart={() => handleDirectionPress("backward")}
              onTouchEnd={handleDirectionRelease}
              onClick={() => onMoveCar("backward")}
              disabled={isAutonomous}
            >
              <ArrowDown className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Recording Control */}
        <div className="mt-auto">
          <Button
            variant="outline"
            className={`w-full ${
              isRecording
                ? "bg-robotics-danger text-white hover:bg-robotics-danger/80"
                : ""
            }`}
            onClick={() => onToggleRecording(!isRecording)}
          >
            {isRecording ? (
              <>
                <Pause className="h-5 w-5 mr-2" />
                <span>Stop Recording</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                <span>Start Recording</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
