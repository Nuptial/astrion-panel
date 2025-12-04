import { ConfigProvider, theme } from "antd";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import ProductsPage from "@/pages/products/ProductsPage";
import ProductDetailsPage from "@/pages/products/ProductDetailsPage";
import ProductFormPage from "@/pages/products/ProductFormPage";
import UsersPage from "@/pages/users/UsersPage";
import UserDetailsPage from "@/pages/users/UserDetailsPage";

const App = () => (
  <ConfigProvider
    theme={{
      algorithm: theme.defaultAlgorithm,
      token: {
        colorPrimary: "#2563eb",
        borderRadius: 12,
        fontFamily:
          "'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      },
    }}
  >
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/add" element={<ProductFormPage />} />
        <Route path="/products/:productId" element={<ProductDetailsPage />} />
        <Route path="/products/:productId/edit" element={<ProductFormPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/:userId" element={<UserDetailsPage />} />
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Route>
    </Routes>
  </ConfigProvider>
);

export default App;
