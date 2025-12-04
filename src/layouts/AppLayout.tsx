import { useEffect, useState } from "react";
import { Button, Drawer, Layout, Menu, Typography } from "antd";
import type { MenuProps } from "antd";
import {
  AppstoreOutlined,
  CloseOutlined,
  MenuOutlined,
  PlusCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";

const { Header, Content, Footer } = Layout;

const AppLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems: MenuProps["items"] = [
    {
      key: "/products",
      icon: <AppstoreOutlined />,
      label: "Products",
    },
    {
      key: "/products/add",
      icon: <PlusCircleOutlined />,
      label: "Add Product",
    },
    {
      key: "/users",
      icon: <TeamOutlined />,
      label: "Users",
    },
  ];

  const menuKeys = (menuItems ?? [])
    .map((item) => (item && typeof item.key === "string" ? item.key : null))
    .filter((key): key is string => Boolean(key));

  const selectedKey = [...menuKeys]
    .sort((a, b) => b.length - a.length)
    .find((key) => location.pathname.startsWith(key));

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleResize = () => {
      setIsDesktop(mediaQuery.matches);
      if (mediaQuery.matches) {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize();
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  const handleNavigate = (key: string) => {
    navigate(key);
    setIsMobileMenuOpen(false);
  };

  return (
    <Layout className="min-h-screen bg-slate-100">
      <Header className="bg-white px-4 py-2 shadow-sm md:px-6 md:py-0">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2">
          <Link
            to="/products"
            className={clsx(
              "flex items-center gap-2 rounded-md border border-transparent px-2 py-1 text-xl font-semibold text-slate-900 transition hover:border-slate-200 hover:bg-slate-100"
            )}
            aria-label="Astrion Panel home"
          >
            Astrion Panel
          </Link>
          <div className="flex flex-1 items-center justify-end gap-2">
            {isDesktop && (
              <div className="flex flex-1 justify-end">
                <Menu
                  mode="horizontal"
                  selectedKeys={selectedKey ? [selectedKey] : []}
                  items={menuItems}
                  onClick={(event) => handleNavigate(event.key.toString())}
                  className="border-none"
                />
              </div>
            )}
            <Button
              type="text"
              icon={<MenuOutlined className="text-xl" />}
              aria-label="Open navigation"
              className="flex items-center text-slate-900 md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            />
          </div>
        </div>
      </Header>
      <Content className="px-4 py-6">
        <main className="mx-auto flex max-w-6xl flex-col gap-6">
          <Outlet />
        </main>
      </Content>
      <Drawer
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        placement="right"
        bodyStyle={{ padding: 0 }}
        headerStyle={{ display: "none" }}
        width={280}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <span className="text-lg font-semibold text-slate-900">
            Astrion Panel
          </span>
          <Button
            type="text"
            icon={<CloseOutlined />}
            aria-label="Close menu"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        </div>
        <Menu
          mode="inline"
          selectedKeys={selectedKey ? [selectedKey] : []}
          items={menuItems}
          onClick={(event) => handleNavigate(event.key.toString())}
          className="border-0"
        />
      </Drawer>
      <Footer className="bg-transparent text-center text-slate-500">
        <Typography.Text>
          © {new Date().getFullYear()} Astrion Panel Admin Platform
        </Typography.Text>
      </Footer>
    </Layout>
  );
};

export default AppLayout;
