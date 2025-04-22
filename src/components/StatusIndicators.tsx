
import React, { useState, useEffect } from 'react';
import { Signal, Wifi, Globe, Cpu } from 'lucide-react';

type StatusIndicatorsProps = {
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  cpu: number;
  wifi: number;
};

const StatusIndicators: React.FC<StatusIndicatorsProps> = ({ connectionStatus, wifi, cpu }) => {
  const [cpuUsage, setCpuUsage] = useState(30);
  const [wifiStrength, setWifiStrength] = useState(80);
  
  // Simulate CPU and WiFi fluctuations
  useEffect(() => {
    setCpuUsage(cpu)
    const interval = setInterval(() => {
      setCpuUsage(prev => {
        const change = Math.random() * 15 - 5;
        return Math.max(10, Math.min(95, prev + change));
      });
      
      setWifiStrength(wifi);
      setWifiStrength(prev => {
        const change = Math.random() * 10 - 4;
        return Math.max(20, Math.min(100, prev + change));
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getConnectionStatusClass = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'status-online';
      case 'connecting':
        return 'status-warning';
      case 'disconnected':
        return 'status-offline';
      default:
        return 'status-offline';
    }
  };
  
  const getWifiStrengthIcon = () => {
    if (wifiStrength > 70) {
      return <Wifi className="h-4 w-4 text-robotics-success" />;
    } else if (wifiStrength > 40) {
      return <Wifi className="h-4 w-4 text-robotics-warning" />;
    } else {
      return <Wifi className="h-4 w-4 text-robotics-danger" />;
    }
  };
  
  const getCpuUsageColor = () => {
    if (cpuUsage < 50) {
      return 'text-robotics-success';
    } else if (cpuUsage < 80) {
      return 'text-robotics-warning';
    } else {
      return 'text-robotics-danger';
    }
  };
  
  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-1.5" title="Connection Status">
        <div className={`status-indicator ${getConnectionStatusClass()}`} />
        <span className="hidden sm:inline">
          {connectionStatus === 'connected' ? 'Connected' : connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
        </span>
      </div>
      
      <div className="flex items-center gap-1.5" title={`WiFi Strength: ${wifiStrength}%`}>
        {getWifiStrengthIcon()}
        <span className="hidden sm:inline">{wifiStrength}%</span>
      </div>
      
      <div className="flex items-center gap-1.5" title={`CPU Usage: ${Math.round(cpuUsage)}%`}>
        <Cpu className={`h-4 w-4 ${getCpuUsageColor()}`} />
        <span className="hidden sm:inline">{Math.round(cpuUsage)}%</span>
      </div>
      
      <div className="flex items-center gap-1.5" title="Latency: 35ms">
        <Signal className="h-4 w-4 text-robotics-blue" />
        <span className="hidden sm:inline">35ms</span>
      </div>
    </div>
  );
};

export default StatusIndicators;
