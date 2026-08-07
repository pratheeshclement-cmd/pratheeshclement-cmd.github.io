// ─── DMOS Enterprise Design System — Shared Components v6 ───────────────────

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown, Minus, X, Check, AlertTriangle, Info, Loader2 } from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// CARD
// ═════════════════════════════════════════════════════════════════════════════
interface CardProps {
  children: ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  padding?: number | string;
  variant?: 'default' | 'elevated' | 'glass' | 'primary';
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

export const Card: React.FC<CardProps> = ({
  children, style, className, onClick, hover = false, padding = 20, variant = 'default',
  onDragOver, onDragLeave, onDrop,
}) => {
  const variantClass = variant === 'elevated' ? 'dmos-card-elevated'
    : variant === 'glass' ? 'dmos-card-glass'
    : variant === 'primary' ? 'dmos-card-primary'
    : 'dmos-card';

  return (
    <div
      onClick={onClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`${variantClass} ${className ?? ''}`}
      style={{
        padding,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.18s cubic-bezier(0.4,0,0.2,1)',
        ...style,
      }}
      onMouseEnter={e => {
        if (hover || onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.30)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
        }
      }}
      onMouseLeave={e => {
        if (hover || onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '';
          e.currentTarget.style.borderColor = '';
        }
      }}
    >
      {children}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// METRIC CARD
// ═════════════════════════════════════════════════════════════════════════════
interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  iconBg?: string;
  isPercent?: boolean;
  suffix?: string;
  style?: React.CSSProperties;
  loading?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label, value, change, changeLabel, icon, iconBg, isPercent, suffix, style, loading,
}) => {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  if (loading) {
    return (
      <Card style={{ padding: '20px', ...style }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <div className="dmos-skeleton" style={{ height: 12, width: 80 }} />
          <div className="dmos-skeleton" style={{ height: 34, width: 34, borderRadius: 8 }} />
        </div>
        <div className="dmos-skeleton" style={{ height: 28, width: 100, marginBottom: 10 }} />
        <div className="dmos-skeleton" style={{ height: 10, width: 60 }} />
      </Card>
    );
  }

  return (
    <Card style={{ padding: '20px', ...style }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--dmos-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1 }}>
          {label}
        </span>
        {icon && (
          <div style={{
            width: 34, height: 34, borderRadius: 9, flexShrink: 0,
            background: iconBg ?? 'var(--dmos-primary-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            {icon}
          </div>
        )}
      </div>

      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--dmos-text)', letterSpacing: '-0.03em', lineHeight: 1 }}>
        {value}{suffix}
      </div>

      {change !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, fontSize: '0.72rem' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3, fontWeight: 700,
            color: isPositive ? 'var(--dmos-success)' : isNegative ? 'var(--dmos-danger)' : 'var(--dmos-text-muted)',
            background: isPositive ? 'var(--dmos-success-bg)' : isNegative ? 'var(--dmos-danger-bg)' : 'rgba(255,255,255,0.06)',
            padding: '2px 7px', borderRadius: 'var(--dmos-radius-full)',
          }}>
            {isPositive && <TrendingUp size={11} />}
            {isNegative && <TrendingDown size={11} />}
            {!isPositive && !isNegative && <Minus size={11} />}
            {isPositive ? '+' : ''}{change}{isPercent ? '%' : ''}
          </span>
          {changeLabel && <span style={{ color: 'var(--dmos-text-subtle)' }}>{changeLabel}</span>}
        </div>
      )}
    </Card>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// SECTION HEADER
// ═════════════════════════════════════════════════════════════════════════════
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  style?: React.CSSProperties;
  badge?: ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, action, style, badge }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18, ...style }}>
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: subtitle ? 4 : 0 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dmos-text)', margin: 0, lineHeight: 1 }}>{title}</h2>
        {badge}
      </div>
      {subtitle && <p style={{ fontSize: '0.78rem', color: 'var(--dmos-text-muted)', margin: 0, lineHeight: 1.4 }}>{subtitle}</p>}
    </div>
    {action && <div style={{ flexShrink: 0 }}>{action}</div>}
  </div>
);

// ═════════════════════════════════════════════════════════════════════════════
// BADGE
// ═════════════════════════════════════════════════════════════════════════════
interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'primary' | 'secondary' | 'neutral' | 'purple' | 'accent' | 'info';
  dot?: boolean;
  pulse?: boolean;
  style?: React.CSSProperties;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', dot, pulse, style, size = 'md' }) => {
  const cls = `dmos-badge dmos-badge-${variant === 'purple' ? 'accent' : variant}`;
  const sizeStyle: React.CSSProperties = size === 'sm'
    ? { fontSize: '0.62rem', padding: '2px 6px' } : {};

  return (
    <span className={cls} style={{ ...sizeStyle, ...style }}>
      {dot && (
        <span className={`dmos-status-dot ${variant === 'success' ? 'success' : variant === 'warning' ? 'warning' : variant === 'danger' ? 'danger' : 'neutral'}${pulse ? ' pulse' : ''}`}
          style={{ width: 6, height: 6 }} />
      )}
      {children}
    </span>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// GAUGE (SVG Ring)
// ═════════════════════════════════════════════════════════════════════════════
interface GaugeProps {
  value: number;
  max?: number;
  label?: string;
  sublabel?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const Gauge: React.FC<GaugeProps> = ({ value, max = 100, label, sublabel, size = 110, color, strokeWidth = 10 }) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;
  const cx = size / 2;
  const cy = size / 2;
  const displayColor = color ?? (pct >= 90 ? 'var(--dmos-success)' : pct >= 50 ? 'var(--dmos-warning)' : 'var(--dmos-danger)');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
          <circle
            cx={cx} cy={cy} r={radius}
            fill="none"
            stroke={displayColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <span style={{ fontSize: size > 80 ? '1.3rem' : '1rem', fontWeight: 800, color: 'var(--dmos-text)', lineHeight: 1 }}>{value}</span>
          {sublabel && <span style={{ fontSize: '0.58rem', color: 'var(--dmos-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{sublabel}</span>}
        </div>
      </div>
      {label && <span style={{ fontSize: '0.74rem', color: 'var(--dmos-text-muted)', textAlign: 'center', lineHeight: 1.3 }}>{label}</span>}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// TABS
// ═════════════════════════════════════════════════════════════════════════════
interface Tab { id: string; label: string; icon?: ReactNode; badge?: string | number; }
interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
  style?: React.CSSProperties;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, active, onChange, style }) => (
  <div style={{
    display: 'flex', gap: 2, padding: '3px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 'var(--dmos-radius)',
    border: '1px solid var(--dmos-border)',
    alignSelf: 'flex-start', flexWrap: 'wrap', ...style,
  }}>
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        style={{
          padding: '6px 14px', borderRadius: 8,
          background: active === tab.id ? 'var(--dmos-primary)' : 'transparent',
          border: 'none', cursor: 'pointer',
          color: active === tab.id ? '#fff' : 'var(--dmos-text-muted)',
          fontSize: '0.78rem', fontWeight: active === tab.id ? 600 : 500,
          fontFamily: 'var(--dmos-font-sans)',
          transition: 'all 0.15s',
          display: 'flex', alignItems: 'center', gap: 6,
          boxShadow: active === tab.id ? 'var(--dmos-shadow-primary)' : 'none',
          whiteSpace: 'nowrap',
          minHeight: 32,
        }}
      >
        {tab.icon}
        {tab.label}
        {tab.badge !== undefined && (
          <span style={{
            fontSize: '0.62rem', fontWeight: 700, padding: '1px 5px',
            background: active === tab.id ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.08)',
            borderRadius: 4, color: active === tab.id ? '#fff' : 'var(--dmos-text-subtle)',
          }}>{tab.badge}</span>
        )}
      </button>
    ))}
  </div>
);

// ═════════════════════════════════════════════════════════════════════════════
// BUTTON
// ═════════════════════════════════════════════════════════════════════════════
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children, variant = 'primary', size = 'md', leftIcon, rightIcon, loading, style, disabled, ...rest
}) => {
  const sizeStyle: React.CSSProperties = size === 'xs' ? { padding: '4px 10px', fontSize: '0.72rem', minHeight: 28 }
    : size === 'sm' ? { padding: '6px 13px', fontSize: '0.78rem', minHeight: 34 }
    : size === 'lg' ? { padding: '12px 24px', fontSize: '0.92rem', minHeight: 48 }
    : { padding: '8px 18px', fontSize: '0.84rem', minHeight: 40 };

  const variantCls = `dmos-btn dmos-btn-${variant}`;

  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={variantCls}
      style={{
        ...sizeStyle,
        borderRadius: 'var(--dmos-radius)',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontFamily: 'var(--dmos-font-sans)',
        fontWeight: 600,
        ...style,
      }}
    >
      {loading && <Loader2 size={14} style={{ animation: 'dmos-spin 0.7s linear infinite' }} />}
      {!loading && leftIcon}
      {children}
      {rightIcon}
    </button>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// PROGRESS BAR
// ═════════════════════════════════════════════════════════════════════════════
interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value, max = 100, color, height = 6, showLabel, animated,
}) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const barColor = color ?? (pct > 70 ? 'var(--dmos-danger)' : pct > 40 ? 'var(--dmos-warning)' : 'var(--dmos-success)');

  return (
    <div>
      <div style={{
        width: '100%', height, background: 'rgba(255,255,255,0.07)', borderRadius: 999, overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`, height: '100%',
          background: color ?? 'var(--dmos-primary)',
          borderRadius: 999,
          transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
          animation: animated ? 'dmos-shimmer 2s infinite' : undefined,
        }} />
      </div>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4, fontSize: '0.68rem', color: 'var(--dmos-text-subtle)' }}>
          {pct.toFixed(0)}%
        </div>
      )}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// DATA TABLE (Desktop Table + Mobile Cards)
// ═════════════════════════════════════════════════════════════════════════════
export interface Column<T> {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
  render?: (row: T) => ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends Record<string, any>>({ columns, data, loading, emptyMessage = 'No data available', onRowClick }: DataTableProps<T>) {
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="dmos-skeleton" style={{ height: 46 }} />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--dmos-text-subtle)', fontSize: '0.84rem' }}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div>
      {/* Desktop Table */}
      <div className="dmos-table-desktop" style={{ width: '100%', overflowX: 'auto' }}>
        <table className="dmos-table">
          <thead>
            <tr>
              {columns.map(c => (
                <th key={c.key} style={{ textAlign: c.align || 'left', width: c.width }}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={idx}
                onClick={() => onRowClick?.(row)}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map(c => (
                  <td key={c.key} style={{ textAlign: c.align || 'left' }}>
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="dmos-table-mobile-cards">
        {data.map((row, idx) => (
          <Card key={idx} onClick={() => onRowClick?.(row)} style={{ padding: 14 }}>
            {columns.map(c => (
              <div key={c.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', fontSize: '0.78rem', borderBottom: '1px solid var(--dmos-border)' }}>
                <span style={{ color: 'var(--dmos-text-subtle)', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{c.label}</span>
                <div style={{ textAlign: 'right', color: 'var(--dmos-text)' }}>
                  {c.render ? c.render(row) : row[c.key]}
                </div>
              </div>
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// EMPTY STATE
// ═════════════════════════════════════════════════════════════════════════════
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  style?: React.CSSProperties;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action, style }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    textAlign: 'center', padding: '56px 24px', gap: 16, ...style,
  }}>
    {icon && (
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: 'rgba(255,255,255,0.04)', border: '1px solid var(--dmos-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4,
      }}>
        {icon}
      </div>
    )}
    <div>
      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--dmos-text)', marginBottom: 6 }}>{title}</div>
      {description && <div style={{ fontSize: '0.78rem', color: 'var(--dmos-text-subtle)', maxWidth: 320, margin: '0 auto', lineHeight: 1.5 }}>{description}</div>}
    </div>
    {action}
  </div>
);

// ═════════════════════════════════════════════════════════════════════════════
// LOADING SKELETON (generic)
// ═════════════════════════════════════════════════════════════════════════════
export const LoadingSkeleton: React.FC<{ lines?: number; style?: React.CSSProperties }> = ({ lines = 3, style }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, ...style }}>
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="dmos-skeleton" style={{ height: 14, width: i === lines - 1 ? '60%' : '100%' }} />
    ))}
  </div>
);

// ═════════════════════════════════════════════════════════════════════════════
// STAT ROW
// ═════════════════════════════════════════════════════════════════════════════
interface StatRowProps {
  label: string;
  value: ReactNode;
  sublabel?: string;
  style?: React.CSSProperties;
}

export const StatRow: React.FC<StatRowProps> = ({ label, value, sublabel, style }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 0', borderBottom: '1px solid var(--dmos-border)', ...style,
  }}>
    <div>
      <div style={{ fontSize: '0.82rem', color: 'var(--dmos-text-muted)' }}>{label}</div>
      {sublabel && <div style={{ fontSize: '0.68rem', color: 'var(--dmos-text-subtle)', marginTop: 2 }}>{sublabel}</div>}
    </div>
    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--dmos-text)', textAlign: 'right' }}>{value}</div>
  </div>
);

// ═════════════════════════════════════════════════════════════════════════════
// STATUS INDICATOR
// ═════════════════════════════════════════════════════════════════════════════
interface StatusIndicatorProps {
  status: 'connected' | 'auth_required' | 'not_connected' | 'error' | 'healthy' | 'warning' | 'loading';
  label?: string;
  pulse?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label, pulse }) => {
  const colorMap: Record<string, string> = {
    connected: 'var(--dmos-success)',
    healthy: 'var(--dmos-success)',
    auth_required: 'var(--dmos-warning)',
    warning: 'var(--dmos-warning)',
    not_connected: 'var(--dmos-text-subtle)',
    error: 'var(--dmos-danger)',
    loading: 'var(--dmos-primary)',
  };
  const color = colorMap[status] ?? 'var(--dmos-text-subtle)';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: 8, height: 8, flexShrink: 0 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
        {pulse && (status === 'connected' || status === 'healthy') && (
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%', background: color,
            animation: 'dmos-ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
          }} />
        )}
      </div>
      {label && <span style={{ fontSize: '0.74rem', fontWeight: 600, color }}>{label}</span>}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// CONNECTION CARD (enterprise API gateway card)
// ═════════════════════════════════════════════════════════════════════════════
interface ConnectionCardProps {
  id: string;
  name: string;
  category: string;
  status: 'connected' | 'auth_required' | 'not_connected' | 'error';
  latencyMs: number;
  lastSync: string;
  quotaUsedPercent: number;
  apiVersion: string;
  docsUrl: string;
  icon?: ReactNode;
  onReconnect?: () => void;
  onConfigure?: () => void;
}

export const ConnectionCard: React.FC<ConnectionCardProps> = ({
  name, category, status, latencyMs, lastSync, quotaUsedPercent, apiVersion, docsUrl, icon, onReconnect, onConfigure,
}) => {
  const statusLabel = status === 'connected' ? 'Connected'
    : status === 'auth_required' ? 'Auth Required'
    : status === 'not_connected' ? 'Not Connected'
    : 'Error';

  const statusVariant = status === 'connected' ? 'success'
    : status === 'auth_required' ? 'warning'
    : status === 'not_connected' ? 'neutral'
    : 'danger';

  const latencyColor = latencyMs < 100 ? 'var(--dmos-success)'
    : latencyMs < 300 ? 'var(--dmos-warning)'
    : 'var(--dmos-danger)';

  return (
    <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          {icon && (
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--dmos-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {icon}
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--dmos-text)', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {name}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--dmos-text-subtle)', marginTop: 3 }}>{category} · v{apiVersion}</div>
          </div>
        </div>
        <Badge variant={statusVariant} pulse={status === 'connected'}>{statusLabel}</Badge>
      </div>

      {/* Quota Bar */}
      {status === 'connected' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: '0.68rem', color: 'var(--dmos-text-subtle)' }}>
            <span>Quota Usage</span>
            <span style={{ fontWeight: 600, color: 'var(--dmos-text-muted)' }}>{quotaUsedPercent}%</span>
          </div>
          <ProgressBar value={quotaUsedPercent} color={quotaUsedPercent > 70 ? 'var(--dmos-danger)' : quotaUsedPercent > 40 ? 'var(--dmos-warning)' : 'var(--dmos-success)'} height={4} />
        </div>
      )}

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: 16, paddingTop: 10, borderTop: '1px solid var(--dmos-border)' }}>
        <div>
          <div style={{ fontSize: '0.64rem', color: 'var(--dmos-text-subtle)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Latency</div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: latencyColor }}>
            {latencyMs > 0 ? `${latencyMs}ms` : '—'}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.64rem', color: 'var(--dmos-text-subtle)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Last Sync</div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--dmos-text-muted)' }}>{lastSync}</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'flex-end' }}>
          {(status === 'auth_required' || status === 'not_connected' || status === 'error') && onReconnect && (
            <Button size="xs" variant="secondary" onClick={onReconnect}>Connect</Button>
          )}
          {onConfigure && <Button size="xs" variant="ghost" onClick={onConfigure}>Configure</Button>}
          <a href={docsUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.72rem', color: 'var(--dmos-primary-light)', textDecoration: 'none', padding: '4px 0' }}>
            Docs →
          </a>
        </div>
      </div>
    </Card>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// INPUT
// ═════════════════════════════════════════════════════════════════════════════
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: ReactNode;
  error?: string;
  helper?: string;
}

export const Input: React.FC<InputProps> = ({ label, leftIcon, error, helper, style, ...rest }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    {label && (
      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--dmos-text-muted)' }}>{label}</label>
    )}
    <div style={{ position: 'relative' }}>
      {leftIcon && (
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--dmos-text-subtle)', display: 'flex' }}>
          {leftIcon}
        </span>
      )}
      <input
        className="dmos-input"
        style={{
          paddingLeft: leftIcon ? 38 : 13,
          borderColor: error ? 'var(--dmos-danger-border)' : undefined,
          ...style,
        }}
        {...rest}
      />
    </div>
    {error && <span style={{ fontSize: '0.72rem', color: 'var(--dmos-danger)' }}>{error}</span>}
    {!error && helper && <span style={{ fontSize: '0.72rem', color: 'var(--dmos-text-subtle)' }}>{helper}</span>}
  </div>
);

// ═════════════════════════════════════════════════════════════════════════════
// DIVIDER
// ═════════════════════════════════════════════════════════════════════════════
export const Divider: React.FC<{ style?: React.CSSProperties; label?: string }> = ({ style, label }) => {
  if (label) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, ...style }}>
        <div style={{ flex: 1, height: 1, background: 'var(--dmos-border)' }} />
        <span style={{ fontSize: '0.72rem', color: 'var(--dmos-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{label}</span>
        <div style={{ flex: 1, height: 1, background: 'var(--dmos-border)' }} />
      </div>
    );
  }
  return <div className="dmos-divider" style={style} />;
};

// ═════════════════════════════════════════════════════════════════════════════
// PAGE HEADER
// ═════════════════════════════════════════════════════════════════════════════
interface PageHeaderProps {
  title: string;
  subtitle?: ReactNode;
  badge?: ReactNode;
  actions?: ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, badge, actions }) => (
  <div style={{
    display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start',
    justifyContent: 'space-between', gap: 16, marginBottom: 28,
  }}>
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--dmos-text)', margin: 0, letterSpacing: '-0.02em' }}>{title}</h1>
        {badge}
      </div>
      {subtitle && (
        <p style={{ fontSize: '0.82rem', color: 'var(--dmos-text-muted)', marginTop: 6, margin: '6px 0 0', lineHeight: 1.4 }}>{subtitle}</p>
      )}
    </div>
    {actions && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flexShrink: 0 }}>
        {actions}
      </div>
    )}
  </div>
);
