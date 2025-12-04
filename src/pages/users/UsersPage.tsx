import { useMemo, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import {
  Button,
  Card,
  Input,
  Popconfirm,
  Table,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  EyeOutlined,
  TeamOutlined,
  UserDeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import StatusTag from "@/components/StatusTag";
import { useDeleteUserMutation, useUsersQuery } from "@/hooks/useUsers";
import type { User, UserFilters } from "@/types/user";

const UsersPage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const filters = useMemo<UserFilters>(() => {
    if (!keyword.trim()) {
      return {};
    }

    return { searchTerm: keyword.trim() };
  }, [keyword]);

  const { data: users, isLoading, isError, refetch } = useUsersQuery(filters);
  const { mutate: deleteUser } = useDeleteUserMutation();

  const handleRowActionClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const columns: ColumnsType<User> = [
    {
      title: "Full name",
      dataIndex: "fullName",
      key: "fullName",
      render: (_, user) => (
        <div className="flex flex-col items-start gap-1 px-2 py-1 text-left transition">
          <span className="text-base font-semibold text-slate-900">
            {user.fullName}
          </span>
          <Typography.Text className="text-xs text-slate-500">
            {user.department}
          </Typography.Text>
          <Typography.Text className="text-xs text-slate-400 md:hidden">
            {user.email}
          </Typography.Text>
          <div className="mt-3 flex w-full flex-col gap-2 md:hidden">
            <div className="flex flex-wrap gap-2 table-row-action">
              <Button
                size="small"
                icon={<EyeOutlined />}
                onClick={(event) => {
                  handleRowActionClick(event);
                  navigate(`/users/${user.id}`);
                }}
              >
                View
              </Button>
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={(event) => {
                  handleRowActionClick(event);
                  navigate(`/users/${user.id}`);
                }}
              >
                Edit
              </Button>
              <Popconfirm
                title="Delete user"
                description="This user will be removed from the workspace. Continue?"
                okText="Delete"
                cancelText="Cancel"
                placement="left"
                onConfirm={() => {
                  deleteUser(user.id, {
                    onSuccess: () => message.success("User removed."),
                    onError: (error) => message.error(error.message),
                  });
                }}
                onPopupClick={(event) => event.stopPropagation()}
                onCancel={(event) => event?.stopPropagation()}
                onOpenChange={(_visible, triggerEvent) => {
                  (
                    triggerEvent as React.MouseEvent | MouseEvent | undefined
                  )?.stopPropagation();
                }}
              >
                <Button
                  size="small"
                  danger
                  icon={<UserDeleteOutlined />}
                  onClick={handleRowActionClick}
                >
                  Delete
                </Button>
              </Popconfirm>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      responsive: ["md"],
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: User["role"]) => role.toUpperCase(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: User["status"]) => <StatusTag status={status} />,
    },
    {
      title: "Actions",
      key: "actions",
      responsive: ["sm"],
      render: (_, user) => (
        <div className="flex gap-2 table-row-action">
          <Button
            icon={<EyeOutlined />}
            className="flex items-center"
            onClick={(event) => {
              handleRowActionClick(event);
              navigate(`/users/${user.id}`);
            }}
          >
            View
          </Button>
          <Popconfirm
            title="Delete user"
            description="This user will be removed from the workspace. Continue?"
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => {
              deleteUser(user.id, {
                onSuccess: () => message.success("User removed."),
                onError: (error) => message.error(error.message),
              });
            }}
            onPopupClick={(event) => event.stopPropagation()}
            onCancel={(event) => event?.stopPropagation()}
            onOpenChange={(_visible, triggerEvent) => {
              (
                triggerEvent as ReactMouseEvent | MouseEvent | undefined
              )?.stopPropagation();
            }}
          >
            <Button
              danger
              icon={<UserDeleteOutlined />}
              className="flex items-center"
              onClick={handleRowActionClick}
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Card className="border-none shadow-sm">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Users"
          subtitle="Browse team members, inspect details, and keep profiles up to date."
          extra={
            <Button
              icon={<TeamOutlined />}
              onClick={() => navigate("/users")}
              className="flex items-center"
            >
              Total: {users?.length ?? 0}
            </Button>
          }
        />

        <Input.Search
          allowClear
          placeholder="Search by name, email, or department"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          aria-label="Search users"
        />

        <Table<User>
          rowKey="id"
          loading={isLoading}
          dataSource={users ?? []}
          columns={columns}
          pagination={{ pageSize: 6, showSizeChanger: false }}
          scroll={{ x: 720 }}
          rowClassName={() => "clickable-table-row"}
          locale={{
            emptyText: isError ? (
              <div className="flex flex-col items-center gap-2 py-6">
                <p className="text-base font-semibold text-slate-900">
                  Users could not be loaded.
                </p>
                <Button onClick={() => refetch()}>Retry</Button>
              </div>
            ) : undefined,
          }}
          onRow={(user) => ({
            onClick: () => navigate(`/users/${user.id}`),
            onMouseDown: (event) => {
              const target = event.target as HTMLElement;
              if (
                target.closest("button") &&
                target.closest(".table-row-action")
              ) {
                event.stopPropagation();
              }
            },
          })}
        />
      </div>
    </Card>
  );
};

export default UsersPage;
