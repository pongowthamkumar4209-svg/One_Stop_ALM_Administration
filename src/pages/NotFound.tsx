import { useLocation, Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
      <div className="text-6xl font-mono font-bold text-muted-foreground/20">404</div>
      <p className="text-sm text-muted-foreground font-mono">
        Route not found: <span className="text-primary">{location.pathname}</span>
      </p>
      <Link to="/" className="text-xs text-primary hover:underline">
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
