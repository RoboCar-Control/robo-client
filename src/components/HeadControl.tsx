
import React, { useState } from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Gamepad2
} from 'lucide-react';
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

type HeadControlProps = {
  onHeadDirectionChange: (direction: string | null) => void;
  moveCarHead: (direction: string) => void
};

const HeadControl: React.FC<HeadControlProps> = ({
  onHeadDirectionChange,
  moveCarHead,
}) => {
  const [activeDirection, setActiveDirection] = useState<string | null>(null);

  const handleHeadDirectionPress = (direction: string) => {
    console.log(direction);
    moveCarHead(direction)
    onHeadDirectionChange(direction);
  };

  return (
    <div className="dashboard-panel h-full flex flex-col">
      <div className="panel-header">
        <Gamepad2 className="h-5 w-5" />
        <span>Head Control Panel</span>
      </div>

      <div className="flex flex-col gap-6">
        {/* Direction Controls */}
        <div className={`grid grid-cols-3 gap-2`}>
          <div className="col-start-2">
            <button
              className={`control-button ${
                activeDirection === "forward" ? "control-button-active" : ""
              }`}
              onMouseDown={() => handleHeadDirectionPress("u")}
              onTouchStart={() => handleHeadDirectionPress("u")}
            >
              <ArrowUp className="h-6 w-6" />
            </button>
          </div>
          <div className="col-start-1 row-start-2">
            <button
              className={`control-button ${
                activeDirection === "left" ? "control-button-active" : ""
              }`}
              onMouseDown={() => handleHeadDirectionPress("l")}
              onTouchStart={() => handleHeadDirectionPress("l")}
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
          </div>
          {/* <div className="col-start-2 row-start-2">
            <button
              className={`control-button ${
                activeDirection === "stop" ? "control-button-active" : ""
              }`}
              onMouseDown={() => handleHeadDirectionPress("stop", 0)}
              onMouseUp={handleDirectionRelease}
              onMouseLeave={handleDirectionRelease}
              onTouchStart={() => handleHeadDirectionPress("stop", 0)}
              onTouchEnd={handleDirectionRelease}
              onClick={() => onStopCar()}
              disabled={isAutonomous}
            >
              <Square className="h-6 w-6" />
            </button>
          </div> */}
          <div className="col-start-3 row-start-2">
            <button
              className={`control-button ${
                activeDirection === "right" ? "control-button-active" : ""
              }`}
              onMouseDown={() => handleHeadDirectionPress("r")}
              onTouchStart={() => handleHeadDirectionPress("r")}
            >
              <ArrowRight className="h-6 w-6" />
            </button>
          </div>
          <div className="col-start-2 row-start-3">
            <button
              className={`control-button ${
                activeDirection === "backward" ? "control-button-active" : ""
              }`}
              onMouseDown={() => handleHeadDirectionPress("d")}
              onTouchStart={() => handleHeadDirectionPress("d")}
            >
              <ArrowDown className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadControl;