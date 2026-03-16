import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('TrustVault UI crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="glass-panel max-w-lg p-8 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-vault-gold">TrustVault</p>
            <h1 className="mt-4 text-4xl font-semibold">We hit an unexpected issue.</h1>
            <p className="mt-4 text-sm leading-6 text-vault-muted">
              Refresh the page to continue. If the issue keeps happening, the application error is
              being logged in the browser console.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

