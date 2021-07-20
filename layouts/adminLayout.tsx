import {
  DashboardOutlined,
  LaptopOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import styles from "./adminLayout.module.css";

const { Header, Sider, Content } = Layout;

export default function AdminLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const router = useRouter();

  function toggle() {
    setCollapsed(!collapsed);
  }

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className={styles.logo} />
        <Menu theme="dark" mode="inline" selectedKeys={[router.pathname]}>
          <Menu.Item key="/" icon={<DashboardOutlined />}>
            <Link href="/">ダッシュボード</Link>
          </Menu.Item>
          <Menu.Item key="/users" icon={<UserOutlined />}>
            <Link href="/users">利用者</Link>
          </Menu.Item>
          <Menu.Item key="/equipments" icon={<LaptopOutlined />}>
            <Link href="/equipments">備品</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className={styles.siteLayoutBackground} style={{ padding: 0 }}>
          {collapsed ? (
            <MenuUnfoldOutlined className={styles.trigger} onClick={toggle} />
          ) : (
            <MenuFoldOutlined className={styles.trigger} onClick={toggle} />
          )}
        </Header>
        <Content
          className={styles.siteLayoutBackground}
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
