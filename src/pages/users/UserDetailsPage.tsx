import { Button, Card, Descriptions, Form, Input, Result, Select, Skeleton, message } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, UserDeleteOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import StatusTag from '@/components/StatusTag';
import { USER_ROLE_OPTIONS, USER_STATUS_OPTIONS } from '@/constants/categories';
import { useDeleteUserMutation, useUpdateUserMutation, useUserQuery } from '@/hooks/useUsers';
import type { UserPayload } from '@/types/user';

const UserDetailsPage = () => {
  const [form] = Form.useForm<UserPayload>();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { data: user, isLoading, isError, error } = useUserQuery(userId);
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUserMutation();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUserMutation();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        location: user.location,
        department: user.department,
        bio: user.bio,
      });
    }
  }, [form, user]);

  const handleSubmit = (values: UserPayload) => {
    if (!userId) {
      return;
    }

    updateUser(
      { id: userId, payload: values },
      {
        onSuccess: () => message.success('User profile updated.'),
        onError: (updateError) => message.error(updateError.message),
      },
    );
  };

  const handleDelete = () => {
    if (!userId) {
      return;
    }

    deleteUser(userId, {
      onSuccess: () => {
        message.success('User deleted.');
        navigate('/users');
      },
      onError: (deleteError) => message.error(deleteError.message),
    });
  };

  if (isLoading) {
    return (
      <Card className="border-none shadow-sm">
        <Skeleton active paragraph={{ rows: 8 }} />
      </Card>
    );
  }

  if (isError || !user) {
    return (
      <Result
        status="error"
        title="User not found"
        subTitle={error?.message}
        extra={
          <Button type="primary" onClick={() => navigate('/users')}>
            Back to users
          </Button>
        }
      />
    );
  }

  return (
    <Card className="border-none shadow-sm">
      <div className="flex flex-col gap-6">
        <PageHeader
          title={user.fullName}
          subtitle={user.department}
          extra={
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
              <StatusTag status={user.status} />
              <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} className="flex items-center">
                Back
              </Button>
              <Button
                danger
                icon={<UserDeleteOutlined />}
                onClick={handleDelete}
                loading={isDeleting}
                className="flex items-center"
              >
                Delete
              </Button>
            </div>
          }
        />

        <Descriptions
          bordered
          column={{ xs: 1, sm: 1, md: 2 }}
          items={[
            { label: 'Email', key: 'email', children: user.email },
            { label: 'Phone', key: 'phone', children: user.phone },
            { label: 'Role', key: 'role', children: user.role.toUpperCase() },
            { label: 'Department', key: 'department', children: user.department },
            { label: 'Location', key: 'location', children: user.location },
            {
              label: 'Member since',
              key: 'createdAt',
              children: new Date(user.createdAt).toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              }),
            },
          ]}
        />

        <Form layout="vertical" form={form} onFinish={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <Form.Item
            label="Full name"
            name="fullName"
            rules={[{ required: true, message: 'Full name is required.' }]}
          >
            <Input placeholder="Full name" />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="name@astrionpanel.com" />
          </Form.Item>

          <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Phone number is required.' }]}>
            <Input placeholder="+1 (555) 000-0000" />
          </Form.Item>

          <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Select a role.' }]}>
            <Select options={USER_ROLE_OPTIONS} placeholder="Choose a role" />
          </Form.Item>

          <Form.Item label="Status" name="status" rules={[{ required: true, message: 'Select a status.' }]}>
            <Select options={USER_STATUS_OPTIONS} placeholder="Choose a status" />
          </Form.Item>

          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: 'Location is required.' }]}
          >
            <Input placeholder="City, Country" />
          </Form.Item>

          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true, message: 'Department is required.' }]}
          >
            <Input placeholder="Department name" />
          </Form.Item>

          <Form.Item className="md:col-span-2" label="Bio" name="bio">
            <Input.TextArea rows={4} placeholder="Add a short introduction" />
          </Form.Item>

          <div className="md:col-span-2 flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isUpdating}
              className="flex items-center"
            >
              Save changes
            </Button>
          </div>
        </Form>
      </div>
    </Card>
  );
};

export default UserDetailsPage;

