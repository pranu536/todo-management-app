import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, info);
    }
  }

  handleReload = () => {
    window.location.assign('/');
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="auth-wrapper">
          <section className="card error-boundary-card" role="alert">
            <h1 className="auth-title">Something went wrong</h1>
            <p className="auth-subtitle">
              An unexpected error occurred while rendering the application.
            </p>
            <button type="button" className="btn btn-primary" onClick={this.handleReload}>
              Reload Page
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
