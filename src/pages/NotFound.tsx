import { useLocation, Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-4"
      style={{ background: '#0d0d0d' }}
    >
      <div
        className="text-8xl font-mono font-bold"
        style={{ color: 'rgba(200,0,0,0.25)' }}
      >
        404
      </div>
      <p className="text-sm font-mono" style={{ color: '#666' }}>
        Route not found:{' '}
        <span style={{ color: '#e03030' }}>{location.pathname}</span>
      </p>
      <Link
        to="/"
        className="rounded px-4 py-2 text-xs font-bold transition-all"
        style={{
          background: 'linear-gradient(135deg, #cc0000, #990000)',
          color: '#fff',
          boxShadow: '0 0 14px rgba(200,0,0,0.3)',
        }}
      >
        ← Return to Dashboard
      </Link>
      <p className="text-[10px] font-mono uppercase tracking-widest mt-4" style={{ color: 'rgba(200,0,0,0.3)' }}>
        ⚡ Owned &amp; Built by <span style={{ color: 'rgba(220,0,0,0.55)', fontWeight: 700 }}>Pongowtham</span>
      </p>
    </div>
  );
};

export default NotFound;
