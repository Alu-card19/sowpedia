'use client'

import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  showDetails: boolean
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, showDetails: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, showDetails: false }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#0f1535',
            color: '#ffffff',
            padding: '20px',
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          <div
            style={{
              maxWidth: '600px',
              backgroundColor: '#1a1f3a',
              padding: '40px',
              borderRadius: '12px',
              border: '2px solid #00e5ff',
              boxShadow: '0 0 20px rgba(0, 229, 255, 0.2)',
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                color: '#FFD700',
                marginBottom: '16px',
                fontSize: '32px',
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: '1px',
              }}
            >
              ⚠️ Oops! Something went wrong
            </h1>
            <p
              style={{
                color: '#00e5ff',
                marginBottom: '24px',
                fontSize: '16px',
                lineHeight: '1.6',
              }}
            >
              We encountered an unexpected error. Please try refreshing the page. If the problem persists, contact support.
            </p>

            {this.state.error && (
              <details
                style={{
                  textAlign: 'left',
                  backgroundColor: '#0f1535',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '24px',
                  cursor: 'pointer',
                  border: '1px solid #FF6B9D',
                }}
              >
                <summary
                  style={{
                    fontWeight: 'bold',
                    marginBottom: '12px',
                    color: '#FF6B9D',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  📋 Error Details (for developers)
                </summary>
                <pre
                  style={{
                    overflow: 'auto',
                    fontSize: '12px',
                    margin: '8px 0 0 0',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    color: '#FFB300',
                    maxHeight: '200px',
                  }}
                >
                  {this.state.error.toString()}
                </pre>
              </details>
            )}

            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '12px 24px',
                  background: '#00e5ff',
                  color: '#090d26',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.5px',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#00d4e8'
                  e.currentTarget.style.transform = 'scale(1.05)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#00e5ff'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                Refresh Page
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                style={{
                  padding: '12px 24px',
                  background: 'transparent',
                  color: '#00e5ff',
                  border: '2px solid #00e5ff',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.5px',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 229, 255, 0.1)'
                  e.currentTarget.style.transform = 'scale(1.05)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
