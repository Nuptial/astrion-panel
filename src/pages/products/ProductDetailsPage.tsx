import {
  Button,
  Card,
  Descriptions,
  Image,
  Popconfirm,
  Result,
  Skeleton,
  Tag,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import FavoriteButton from "@/components/FavoriteButton";
import { PRODUCT_CATEGORIES } from "@/constants/categories";
import { useDeleteProductMutation, useProductQuery } from "@/hooks/useProducts";
import { formatCurrency } from "@/utils/formatCurrency";

const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useProductQuery(productId);
  const { mutate: deleteProduct, isPending: isDeleting } =
    useDeleteProductMutation();

  const handleDelete = () => {
    if (!productId) {
      return;
    }

    deleteProduct(productId, {
      onSuccess: () => {
        message.success("Product removed.");
        navigate("/products");
      },
      onError: (deleteError) => {
        message.error(deleteError.message);
      },
    });
  };

  if (isLoading) {
    return (
      <Card className="border-none shadow-sm">
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    );
  }

  if (isError || !product) {
    return (
      <Result
        status="error"
        title="Product not found"
        subTitle={error?.message}
        extra={
          <Button type="primary" onClick={() => navigate("/products")}>
            Back to products
          </Button>
        }
      />
    );
  }

  const categoryLabel = PRODUCT_CATEGORIES.find(
    (option) => option.value === product.category
  )?.label;

  return (
    <Card className="border-none shadow-sm">
      <div className="flex flex-col gap-6">
        <PageHeader
          title={product.name}
          subtitle={product.description}
          extra={
            <>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                className="flex items-center"
              >
                Go Back
              </Button>
              <FavoriteButton productId={product.id} />
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => navigate(`/products/${product.id}/edit`)}
                className="flex items-center"
              >
                Edit
              </Button>
              <Popconfirm
                title="Delete product"
                description="This action cannot be undone. Do you want to proceed?"
                okText="Yes, delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
              >
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  loading={isDeleting}
                  className="flex items-center"
                >
                  Delete
                </Button>
              </Popconfirm>
            </>
          }
        />

        <section className="grid gap-6 md:grid-cols-2">
          <Image
            src={product.imageUrl}
            alt={product.name}
            className="rounded-xl"
            height={360}
            width="100%"
            preview={false}
            fallback="https://placehold.co/600x400"
          />

          <div className="flex flex-col gap-4 rounded-xl bg-slate-50 p-6">
            <div className="flex items-center gap-3">
              <Tag color="blue" className="uppercase tracking-wide">
                {categoryLabel}
              </Tag>
              <span className="text-2xl font-bold text-slate-900">
                {formatCurrency(product.price)}
              </span>
            </div>

            <Descriptions
              bordered
              column={1}
              items={[
                {
                  key: "inventory",
                  label: "Inventory",
                  children: `${product.inventoryCount} units`,
                },
                {
                  key: "createdAt",
                  label: "Created at",
                  children: new Date(product.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  ),
                },
                {
                  key: "identifier",
                  label: "Product ID",
                  children: product.id,
                },
              ]}
            />
          </div>
        </section>
      </div>
    </Card>
  );
};

export default ProductDetailsPage;
