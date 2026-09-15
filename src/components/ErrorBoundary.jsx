import React from "react";
import styled from "styled-components";
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from "lucide-react";

const ErrorContainer = styled.div`
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: var(--color-grey-800, #1e293b);
  background-color: var(--color-grey-50, #f8fafc);
  border-radius: var(--border-radius-lg, 16px);
  margin: 2rem;
  box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05));
  border: 1px solid var(--color-grey-200, #e2e8f0);
`;

const IconWrapper = styled.div`
  width: 7.2rem;
  height: 7.2rem;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: var(--color-grey-900, #0f172a);
`;

const Message = styled.p`
  font-size: 1.45rem;
  color: var(--color-grey-500, #64748b);
  max-width: 52rem;
  line-height: 1.6;
  margin-bottom: 2.4rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 2rem;
  border-radius: var(--border-radius-md, 10px);
  font-size: 1.35rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  &.primary {
    background: var(--color-brand-gradient, linear-gradient(135deg, #0284c7 0%, #2563eb 100%));
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(2, 132, 199, 0.35);
    }
  }

  &.secondary {
    background: var(--color-grey-0, #ffffff);
    color: var(--color-grey-700, #334155);
    border: 1px solid var(--color-grey-300, #cbd5e1);

    &:hover {
      background: var(--color-grey-100, #f1f5f9);
      color: var(--color-grey-900, #0f172a);
    }
  }
`;

const DetailsToggle = styled.button`
  background: transparent;
  border: none;
  color: var(--color-grey-400, #94a3b8);
  font-size: 1.2rem;
  margin-top: 2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: var(--color-grey-600, #475569);
  }
`;

const ErrorDetailsBox = styled.pre`
  margin-top: 1.2rem;
  padding: 1.4rem;
  background: var(--color-grey-900, #0f172a);
  color: #fca5a5;
  border-radius: 8px;
  font-size: 1.15rem;
  text-align: left;
  max-width: 60rem;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, showDetails: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/home";
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <IconWrapper>
            <AlertTriangle size={36} />
          </IconWrapper>
          <Title>{this.props.title || "Đã xảy ra lỗi không mong muốn"}</Title>
          <Message>
            {this.props.message ||
              "Hệ thống gặp sự cố khi hiển thị nội dung này. Vui lòng thử tải lại trang hoặc quay lại trang chủ."}
          </Message>
          <ButtonGroup>
            <ActionButton className="primary" onClick={this.handleReload}>
              <RefreshCw size={16} />
              <span>Tải lại trang</span>
            </ActionButton>
            <ActionButton className="secondary" onClick={this.handleGoHome}>
              <Home size={16} />
              <span>Về trang chủ</span>
            </ActionButton>
          </ButtonGroup>

          <DetailsToggle
            type="button"
            onClick={() =>
              this.setState((prev) => ({ showDetails: !prev.showDetails }))
            }
          >
            <span>{this.state.showDetails ? "Ẩn chi tiết lỗi kỹ thuật" : "Xem chi tiết lỗi kỹ thuật"}</span>
            {this.state.showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </DetailsToggle>

          {this.state.showDetails && this.state.error && (
            <ErrorDetailsBox>
              {this.state.error.toString()}
              {"\n"}
              {this.state.error.stack}
            </ErrorDetailsBox>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
