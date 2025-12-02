import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Play, 
  Cpu, 
  Shield, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Command,
  GitBranch,
  Server,
  Zap
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

export default function App() {
  const [input, setInput] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', timestamp: new Date().toLocaleTimeString(), message: 'AutoDeploy Agent initialized v1.0.0', type: 'info' },
    { id: '2', timestamp: new Date().toLocaleTimeString(), message: 'Connected to Vercel Edge Network', type: 'success' },
    { id: '3', timestamp: new Date().toLocaleTimeString(), message: 'Waiting for command...', type: 'info' }
  ]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    }]);
  };

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    setInput('');
    addLog(`> ${cmd}`, 'info');

    if (cmd.toLowerCase().includes('deploy')) {
      setIsDeploying(true);
      addLog('Analyzing project structure...', 'info');
      
      setTimeout(() => addLog('Detected React + Vite configuration', 'success'), 800);
      setTimeout(() => addLog('Optimizing assets...', 'info'), 1500);
      setTimeout(() => addLog('Building production bundle...', 'warning'), 2500);
      setTimeout(() => {
        addLog('Deployment successful! https://autodeploy-agent.vercel.app', 'success');
        setIsDeploying(false);
      }, 4000);
    } else if (cmd.toLowerCase() === 'clear') {
      setLogs([]);
    } else if (cmd.toLowerCase() === 'help') {
      addLog('Available commands: deploy, status, clear, help', 'info');
    } else {
      addLog(`Unknown command: ${cmd}`, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-deploy-dark text-gray-300 flex flex-col md:flex-row font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-deploy-card border-r border-deploy-border flex flex-col">
        <div className="p-6 border-b border-deploy-border flex items-center gap-3">
          <div className="w-8 h-8 bg-deploy-accent rounded-lg flex items-center justify-center">
            <Cpu className="text-white w-5 h-5" />
          </div>
          <h1 className="font-bold text-white tracking-tight">AutoDeploy</h1>
        </div>
        
        <div className="p-4 space-y-6">
          <div>
            <h3 className="text-xs font-mono text-gray-500 uppercase mb-3">System Status</h3>
            <div className="space-y-2">
              <StatusItem icon={<Activity size={16} />} label="Agent Status" value="Online" status="good" />
              <StatusItem icon={<Server size={16} />} label="Server Load" value="12%" status="good" />
              <StatusItem icon={<Shield size={16} />} label="Security" value="Verified" status="good" />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-mono text-gray-500 uppercase mb-3">Active Project</h3>
            <div className="bg-black/30 rounded-lg p-3 border border-deploy-border">
              <div className="flex items-center gap-2 mb-2">
                <GitBranch size={14} className="text-deploy-accent" />
                <span className="text-sm font-medium text-white">main</span>
              </div>
              <div className="text-xs text-gray-500 font-mono">commit: 8f3a2c1</div>
            </div>
          </div>
        </div>

        <div className="mt-auto p-4 border-t border-deploy-border">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Connected to Agent Network
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-deploy-border flex items-center justify-between px-6 bg-deploy-dark/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Project /</span>
            <span className="text-white font-medium">autodeploy-agent</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-deploy-border rounded-md transition-colors">
              <Zap size={18} />
            </button>
            <button 
              onClick={() => handleCommand({ preventDefault: () => {} } as any)}
              className="bg-white text-black px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Play size={14} />
              Deploy
            </button>
          </div>
        </header>

        {/* Terminal Area */}
        <div className="flex-1 p-6 overflow-hidden flex flex-col">
          <div className="flex-1 bg-black rounded-xl border border-deploy-border flex flex-col overflow-hidden shadow-2xl">
            {/* Terminal Header */}
            <div className="h-10 bg-deploy-card border-b border-deploy-border flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
              </div>
              <div className="ml-4 text-xs font-mono text-gray-500 flex items-center gap-2">
                <Terminal size={12} />
                agent@local:~/workspace
              </div>
            </div>

            {/* Logs */}
            <div className="flex-1 p-4 font-mono text-sm overflow-y-auto space-y-1">
              {logs.map((log) => (
                <div key={log.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-1 duration-300">
                  <span className="text-gray-600 shrink-0">[{log.timestamp}]</span>
                  <span className={`
                    ${log.type === 'error' ? 'text-red-400' : ''}
                    ${log.type === 'success' ? 'text-green-400' : ''}
                    ${log.type === 'warning' ? 'text-yellow-400' : ''}
                    ${log.type === 'info' ? 'text-gray-300' : ''}
                  `}>
                    {log.message}
                  </span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-deploy-border bg-deploy-card/50">
              <form onSubmit={handleCommand} className="flex items-center gap-3">
                <span className="text-deploy-accent font-mono">❯</span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter command (try 'deploy' or 'help')..."
                  className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-white placeholder-gray-600"
                  autoFocus
                  disabled={isDeploying}
                />
                {isDeploying && <Activity className="animate-spin text-deploy-accent" size={16} />}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatusItem({ icon, label, value, status }: { icon: React.ReactNode, label: string, value: string, status: 'good' | 'bad' }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-gray-400">
        {icon}
        <span>{label}</span>
      </div>
      <span className={status === 'good' ? 'text-green-400' : 'text-red-400'}>{value}</span>
    </div>
  );
}