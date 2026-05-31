import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <h2>Ocorreu um erro inesperado.</h2>
          <p>Atualize a página ou volte mais tarde.</p>
          <button className="btn btn-teal" onClick={() => window.location.reload()}>Recarregar</button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
