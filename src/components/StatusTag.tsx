import { Tag } from 'antd';
import type { UserStatus } from '@/types/user';

type StatusTagProps = {
  status: UserStatus;
};

const STATUS_LABELS: Record<UserStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
};

const STATUS_COLORS: Record<UserStatus, string> = {
  active: 'green',
  inactive: 'red',
};

const StatusTag = ({ status }: StatusTagProps) => (
  <Tag
    color={STATUS_COLORS[status]}
    className="flex min-w-[84px] items-center justify-center text-center uppercase tracking-wide font-semibold"
  >
    {STATUS_LABELS[status]}
  </Tag>
);

export default StatusTag;

