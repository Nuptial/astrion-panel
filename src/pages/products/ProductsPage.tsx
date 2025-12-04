import { useMemo, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import {
  Button,
  Card,
  Input,
  Popconfirm,
  Select,
  Table,
  Tag,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import PageHeader from "@/components/PageHeader";
import FavoriteButton from "@/components/FavoriteButton";
import { PRODUCT_CATEGORIES } from "@/constants/categories";
import {
  useDeleteProductMutation,
  useProductsQuery,
} from "@/hooks/useProducts";
import type { Product, ProductCategory, ProductFilters } from "@/types/product";
import { formatCurrency } from "@/utils/formatCurrency";

const categoryOptions: { label: string; value: ProductCategory | "all" }[] = [
  { label: "All", value: "all" },
  ...PRODUCT_CATEGORIES,
];

const ProductsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    ProductCategory | "all"
  >("all");

  const filters = useMemo<ProductFilters>(() => {
    const normalized: ProductFilters = {};
    if (searchTerm.trim()) {
      normalized.searchTerm = searchTerm.trim();
    }
    if (selectedCategory !== "all") {
      normalized.category = selectedCategory;
    }
    return normalized;
  }, [searchTerm, selectedCategory]);

  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useProductsQuery(filters);
  const { mutate: deleteProductMutation } = useDeleteProductMutation();

  const handleRowActionClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const columns: ColumnsType<Product> = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (_, product) => (
        <div className="flex flex-col items-start gap-1 px-2 py-1 text-left transition">
          <span className="text-base font-semibold text-slate-900">
            {product.name}
          </span>
          <span className="text-xs text-slate-500">{product.description}</span>
          <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-400 md:hidden">
            <span className="rounded-full bg-slate-100 px-2 py-0.5">
              {
                PRODUCT_CATEGORIES.find(
                  (option) => option.value === product.category
                )?.label
              }
            </span>
            <span>{formatCurrency(product.price)}</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5">
              {product.inventoryCount} in stock
            </span>
          </div>
          <div className="mt-3 flex w-full flex-col gap-2 md:hidden">
            <div className="table-row-action" onClick={handleRowActionClick}>
              <FavoriteButton productId={product.id} size="small" />
            </div>
            <div className="flex flex-wrap gap-2 table-row-action">
              <Button
                size="small"
                icon={<EyeOutlined />}
                className="flex items-center"
                onClick={(event) => {
                  handleRowActionClick(event);
                  navigate(`/products/${product.id}`);
                }}
              >
                View
              </Button>
              <Button
                size="small"
                icon={<EditOutlined />}
                className="flex items-center"
                onClick={(event) => {
                  handleRowActionClick(event);
                  navigate(`/products/${product.id}/edit`);
                }}
              >
                Edit
              </Button>
              <Popconfirm
                title="Delete product"
                description="This product will be permanently removed. Continue?"
                okText="Delete"
                cancelText="Cancel"
                placement="left"
                onConfirm={() =>
                  deleteProductMutation(product.id, {
                    onSuccess: () => message.success("Product removed."),
                    onError: (error) => message.error(error.message),
                  })
                }
                onPopupClick={(event) => event.stopPropagation()}
                onCancel={(event) => event?.stopPropagation()}
                onOpenChange={(_visible, triggerEvent) => {
                  (
                    triggerEvent as ReactMouseEvent | MouseEvent | undefined
                  )?.stopPropagation();
                }}
              >
                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  className="flex items-center"
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
      title: "Category",
      dataIndex: "category",
      key: "category",
      responsive: ["sm"],
      render: (category: ProductCategory) => (
        <Tag color="blue" className="uppercase tracking-wide">
          {
            PRODUCT_CATEGORIES.find((option) => option.value === category)
              ?.label
          }
        </Tag>
      ),
    },
    {
      title: "Stock",
      dataIndex: "inventoryCount",
      key: "inventoryCount",
      width: 120,
      responsive: ["md"],
      render: (inventory: number) => (
        <span
          className={clsx(
            "font-semibold",
            inventory < 10 ? "text-red-500" : "text-emerald-600"
          )}
        >
          {inventory}
        </span>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 160,
      responsive: ["md"],
      render: (price: number) => (
        <span className="font-semibold text-slate-900">
          {formatCurrency(price)}
        </span>
      ),
    },
    {
      title: "Favorite",
      key: "favorite",
      width: 160,
      responsive: ["sm"],
      render: (_, product) => (
        <div className="table-row-action" onClick={handleRowActionClick}>
          <FavoriteButton productId={product.id} size="small" />
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 240,
      responsive: ["sm"],
      render: (_, product) => (
        <div className="flex flex-wrap gap-2 table-row-action">
          <Button
            icon={<EyeOutlined />}
            onClick={(event) => {
              handleRowActionClick(event);
              navigate(`/products/${product.id}`);
            }}
            aria-label="View details"
            className="flex items-center"
          >
            View
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={(event) => {
              handleRowActionClick(event);
              navigate(`/products/${product.id}/edit`);
            }}
            className="flex items-center"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete product"
            description="This product will be permanently removed. Continue?"
            okText="Delete"
            cancelText="Cancel"
            placement="left"
            onConfirm={() =>
              deleteProductMutation(product.id, {
                onSuccess: () => message.success("Product removed."),
                onError: (error) => message.error(error.message),
              })
            }
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
              icon={<DeleteOutlined />}
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
          title="Products"
          subtitle="Search, filter, and maintain every product, including favorites."
          extra={
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => navigate("/products/add")}
              className="flex items-center"
            >
              New Product
            </Button>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Input.Search
            allowClear
            className="md:col-span-2"
            placeholder="Search by product name or description"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Search products"
          />
          <Select
            className="w-full"
            options={categoryOptions}
            value={selectedCategory}
            onChange={(value) => setSelectedCategory(value)}
            aria-label="Filter by category"
          />
        </div>

        <Table<Product>
          bordered={false}
          rowKey="id"
          loading={isLoading}
          dataSource={products ?? []}
          columns={columns}
          pagination={{ pageSize: 5, showSizeChanger: false }}
          scroll={{ x: 960 }}
          className="overflow-x-auto"
          rowClassName={() => "clickable-table-row"}
          locale={{
            emptyText: isError ? (
              <div className="flex flex-col items-center gap-2 py-6">
                <p className="text-base font-semibold text-slate-900">
                  Products could not be loaded.
                </p>
                <Button onClick={() => refetch()}>Retry</Button>
              </div>
            ) : undefined,
          }}
          onRow={(product) => ({
            onClick: () => navigate(`/products/${product.id}`),
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

export default ProductsPage;
