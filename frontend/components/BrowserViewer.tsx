'use client';

interface Session {
  session_id: string;
  browser_url: string | null;
  status: string;
  container_id: string | null;
}

interface BrowserViewerProps {
  session: Session | null;
}

export default function BrowserViewer({ session }: BrowserViewerProps) {
  if (!session) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🖥️</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Active Session</h3>
          <p className="text-slate-400">Create or select a session to begin</p>
        </div>
      </div>
    );
  }

  if (session.status !== 'running' || !session.browser_url) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h3 className="text-xl font-semibold text-white mb-2">Session Not Ready</h3>
          <p className="text-slate-400">Status: {session.status}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden h-[calc(100vh-8rem)]">
      <div className="bg-slate-900 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-white font-medium">Active Browser Session</span>
        </div>
        <span className="text-slate-400 text-sm">{session.session_id.slice(0, 8)}</span>
      </div>
      <iframe
        src={session.browser_url}
        className="w-full h-[calc(100%-3rem)] border-0"
        title="Browser Session"
      />
    </div>
  );
}
