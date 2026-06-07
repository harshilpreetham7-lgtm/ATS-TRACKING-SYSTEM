import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error', error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-3xl rounded-[2rem] border border-rose-500/20 bg-slate-900/95 p-10 shadow-2xl shadow-rose-500/10">
            <h1 className="text-3xl font-bold text-rose-300">Something went wrong</h1>
            <p className="mt-4 text-slate-300">The dashboard encountered an issue and cannot render correctly. Refresh the page or try again later.</p>
            <div className="mt-6 rounded-3xl bg-slate-950/80 p-5 text-sm text-slate-300 ring-1 ring-white/10">
              <p className="font-semibold text-white">Error:</p>
              <pre className="mt-2 max-h-72 overflow-auto text-xs text-rose-200">{this.state.error?.toString()}</pre>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
