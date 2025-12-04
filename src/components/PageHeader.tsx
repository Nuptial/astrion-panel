import type { ReactNode } from 'react';
import { Typography } from 'antd';
import clsx from 'clsx';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  extra?: ReactNode;
  className?: string;
};

const PageHeader = ({ title, subtitle, extra, className }: PageHeaderProps) => (
  <div
    className={clsx(
      'flex flex-col gap-3 md:flex-row md:items-center md:justify-between',
      className,
    )}
  >
    <div className="flex flex-col gap-1">
      <Typography.Title level={3} className="!mb-0">
        {title}
      </Typography.Title>
      {subtitle ? (
        <Typography.Text type="secondary" className="text-sm">
          {subtitle}
        </Typography.Text>
      ) : null}
    </div>
    {extra ? <div className="flex flex-wrap gap-2">{extra}</div> : null}
  </div>
);

export default PageHeader;

