import { Button, Card, Form, Input, InputNumber, Select, Skeleton, message } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import { PRODUCT_CATEGORIES } from '@/constants/categories';
import {
  useCreateProductMutation,
  useProductQuery,
  useUpdateProductMutation,
} from '@/hooks/useProducts';
import type { ProductPayload } from '@/types/product';

const ProductFormPage = () => {
  const [form] = Form.useForm<ProductPayload>();
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const isEditMode = Boolean(productId);

  const { data: product, isLoading } = useProductQuery(productId);
  const { mutate: createProduct, isPending: isCreating } = useCreateProductMutation();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProductMutation();

  useEffect(() => {
    if (isEditMode && product) {
      form.setFieldsValue({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        imageUrl: product.imageUrl,
        inventoryCount: product.inventoryCount,
      });
    }
  }, [form, isEditMode, product]);

  const handleSubmit = (values: ProductPayload) => {
    if (isEditMode && productId) {
      updateProduct(
        { id: productId, payload: values },
        {
          onSuccess: () => {
            message.success('Product updated.');
            navigate(`/products/${productId}`);
          },
          onError: (error) => {
            message.error(error.message);
          },
        },
      );
      return;
    }

    createProduct(values, {
      onSuccess: (createdProduct) => {
        message.success('Product created.');
        navigate(`/products/${createdProduct.id}`);
      },
      onError: (error) => {
        message.error(error.message);
      },
    });
  };

  const isBusy = isCreating || isUpdating;

  return (
    <Card className="border-none shadow-sm">
      <div className="flex flex-col gap-6">
        <PageHeader
          title={isEditMode ? 'Edit Product' : 'Add New Product'}
          subtitle={
            isEditMode
              ? 'Adjust product details to keep the catalog up to date.'
              : 'Fill out every field to introduce a new product.'
          }
          extra={
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} className="flex items-center">
              Go Back
            </Button>
          }
        />

        {isEditMode && isLoading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              name: '',
              description: '',
              price: 0,
              category: PRODUCT_CATEGORIES[0]?.value || 'electronics',
              imageUrl: '',
              inventoryCount: 0,
            }}
            className="grid gap-6 md:grid-cols-2"
          >
            <Form.Item
              label="Product name"
              name="name"
              rules={[{ required: true, message: 'Please provide a product name.' }]}
            >
              <Input placeholder="e.g. Wireless Headphones" />
            </Form.Item>

            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: 'Please pick a category.' }]}
            >
              <Select options={PRODUCT_CATEGORIES} placeholder="Select a category" />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: 'Price is required.' }]}
            >
              <InputNumber
                min={0}
                step={100}
                className="w-full"
                addonAfter="$"
                placeholder="0"
              />
            </Form.Item>

            <Form.Item
              label="Inventory"
              name="inventoryCount"
              rules={[{ required: true, message: 'Enter the current inventory.' }]}
            >
              <InputNumber min={0} className="w-full" placeholder="0" />
            </Form.Item>

            <Form.Item
              label="Image URL"
              name="imageUrl"
              rules={[
                { required: true, message: 'Image URL is required.' },
                {
                  validator: (_, value) => {
                    if (!value) {
                      return Promise.resolve();
                    }
                    try {
                      const url = new URL(value);
                      if (!/^https?:$/.test(url.protocol)) {
                        return Promise.reject(new Error('Please enter a valid HTTP or HTTPS URL.'));
                      }
                      return Promise.resolve();
                    } catch {
                      return Promise.reject(new Error('Please enter a valid URL.'));
                    }
                  },
                },
              ]}
            >
              <Input placeholder="https://..." />
            </Form.Item>

            <Form.Item className="md:col-span-2" label="Description" name="description">
              <Input.TextArea rows={4} placeholder="Add a short description" />
            </Form.Item>

            <div className="md:col-span-2 flex justify-end">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={isBusy}
                className="flex items-center"
              >
                {isEditMode ? 'Save changes' : 'Create product'}
              </Button>
            </div>
          </Form>
        )}
      </div>
    </Card>
  );
};

export default ProductFormPage;

