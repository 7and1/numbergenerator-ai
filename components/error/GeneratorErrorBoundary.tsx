"use client";

import { Component, ReactNode } from "react";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import { trackEvent } from "@/lib/analytics";

interface GeneratorErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  toolName?: string;
  onReset?: () => void;
}

interface GeneratorErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

function generateErrorId(): string {
  return "gen-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9);
}

/**
 * Error boundary specifically for generator components.
 * Catches errors in the generator without breaking the entire page.
 */
export class GeneratorErrorBoundary extends Component<
  GeneratorErrorBoundaryProps,
  GeneratorErrorBoundaryState
> {
  constructor(props: GeneratorErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): GeneratorErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorId: generateErrorId(),
    };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack?: string }) {
    const errorId = this.state.errorId || generateErrorId();

    // Log error in development
    if (process.env.NODE_ENV === "development") {
      console.error("Generator error boundary caught:", error, errorInfo);
    }

    // Track error to analytics
    trackEvent("error_generator", {
      errorId,
      toolName: this.props.toolName || "unknown",
      message: error.message,
      hasComponentStack: !!errorInfo.componentStack,
      timestamp: Date.now(),
    });
  }

  handleReset = () => {
    // Track reset action
    if (this.state.errorId) {
      trackEvent("error_generator_reset", {
        errorId: this.state.errorId,
        toolName: this.props.toolName,
      });
    }

    // Call custom reset handler if provided
    if (this.props.onReset) {
      this.props.onReset();
    }

    // Reset error state
    this.setState({
      hasError: false,
      error: null,
      errorId: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorId } = this.state;
      const toolName = this.props.toolName || "Generator";

      return (
        <ErrorDisplay
          title="Generator Error"
          message={`The ${toolName} encountered an unexpected error. You can try resetting the parameters or generating again.`}
          severity="error"
          errorId={errorId || undefined}
          technicalDetails={
            process.env.NODE_ENV === "development" && error
              ? error.stack || error.message
              : undefined
          }
          actions={[
            {
              label: "Reset Parameters",
              onClick: this.handleReset,
              variant: "primary",
            },
          ]}
        />
      );
    }

    return this.props.children;
  }
}
