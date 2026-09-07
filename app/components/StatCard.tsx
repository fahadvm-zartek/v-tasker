import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  tone?: 'default' | 'danger';
  subtitle?: string;
  note?: string;
  action?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  tone = 'default',
  subtitle,
  note,
  action,
}) => {
  const isDanger = tone === 'danger';

  return (
    <div
      className={`ui-card min-h-[128px] overflow-hidden p-4 ${isDanger ? 'ui-card-danger' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className={`text-[12px] font-medium leading-4 ${isDanger ? 'text-[#c62828]' : 'text-[#68758d]'}`}>
          {title}
        </p>
        <div className="shrink-0">{icon}</div>
      </div>
      <div
        className={`mt-5 break-words text-[30px] font-bold leading-8 ${
          isDanger ? 'text-[#b91c1c]' : 'text-[#202b3d]'
        }`}
      >
        {value}
      </div>
      {subtitle ? <p className="mt-1 text-[10px] leading-3 text-[#6f7d94]">{subtitle}</p> : null}
      {note ? <p className="mt-0.5 text-[9px] font-semibold leading-3 text-[#596780]">{note}</p> : null}
      {action ? <p className="mt-1 text-[11px] font-bold leading-3 text-[#0b63ce]">{action}</p> : null}
    </div>
  );
};

export default StatCard;
