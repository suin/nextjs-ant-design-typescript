# Next.js + Ant Design + TypeScriptのデモ

Next.jsでAnt Designを使うデモです。

## Next.jsプロジェクトを生成する

```bash
mkdir nextjs-ant-design-typescript
cd nextjs-ant-design-typescript
npx create-next-app --ts .
```

## Gitリポジトリを初期化する

```bash
rm -rf .git
git init
git commit --allow-empty --message="chore: 🤖 new repo"
git add -A
git commit --allow-empty --message="chore: 🤖 add generated Next.js code"
```

## Next.jsの開発サーバーを起動する

次のコマンドを実行して開発サーバーが起動できればOK:

```bash
yarn dev
```

## Ant Designパッケージをインストールする

```bash
yarn add antd
```

## 管理画面レイアウトを作る

[layouts/adminLayout.tsx](./layouts/adminLayout.tsx)を実装する:

```tsx
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { ReactNode, useState } from "react";
import styles from "./adminLayout.module.css";

const { Header, Sider, Content } = Layout;

function AdminLayout({ children }: { readonly children: ReactNode }) {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  function toggle() {
    setCollapsed(!collapsed);
  }

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className={styles.logo}/>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<UserOutlined/>}>
            nav 1
          </Menu.Item>
          <Menu.Item key="2" icon={<VideoCameraOutlined/>}>
            nav 2
          </Menu.Item>
          <Menu.Item key="3" icon={<UploadOutlined/>}>
            nav 3
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className={styles.siteLayoutBackground} style={{ padding: 0 }}>
          {collapsed ? (
            <MenuUnfoldOutlined className={styles.trigger} onClick={toggle}/>
          ) : (
            <MenuFoldOutlined className={styles.trigger} onClick={toggle}/>
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

export default AdminLayout;
```

管理画面レイアウト用のCSSモジュールも[layouts/adminLayout.module.css](./layouts/adminLayout.module.css)に作る:

```css
.trigger {
    padding: 0 24px;
    font-size: 18px;
    line-height: 64px;
    cursor: pointer;
    transition: color 0.3s;
}

.trigger:hover {
    color: #1890ff;
}

.logo {
    height: 32px;
    margin: 16px;
    background: rgba(255, 255, 255, 0.3);
}

.siteLayoutBackground {
    background: #fff;
}
```

## pages/_app.tsxにてAnt DesignのグローバルCSSをimportする

[pages/_app.tsx](./pages/_app.tsx)に次の行を追加する:

```ts
import 'antd/dist/antd.css';
```

## 管理画面レイアウトをページで使う

[pages/index.tsx](./pages/index.tsx)のコードをまるっと次のコードに置き換える:

```tsx
import dynamic from "next/dynamic";

const AdminLayout = dynamic(() => import("../layouts/adminLayout"), {
  ssr: false,
});

export default function Home() {
  return <AdminLayout>コンテンツ</AdminLayout>;
}
```

`dynamic`で`import`しているのは、Ant Designの`Layout`コンポーネントが依存するコンポーネントで`useLayoutEffect`
が使われているため。SSRを無効にする必要がある。次のissueが直るまでの対処法。

- [Select mode="multiple" throws useLayoutEffect warning in Next.js · Issue #30396 · ant-design/ant-design](https://github.com/ant-design/ant-design/issues/30396)

次のような見た目になればOK:

![](./docs/1.png)

## サイドバーのメニューをNext.jsのルーターとインテグする

ここでは、サイドバーのメニューをクリックしたときに、Next.jsのルーターを使って画面遷移できるようにするのと、現在アクセス中のURLに応じてメニューをハイライトするようにします。

まず、管理画面レイアウト`AdminLayout`が全ページで適用されるようにしたいので、`index.tsx`から`_app.tsx`に移動します:

```tsx
// pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import "antd/dist/antd.css";
import dynamic from "next/dynamic";

const AdminLayout = dynamic(() => import("../layouts/adminLayout"), {
  ssr: false,
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AdminLayout>
      <Component {...pageProps} />
    </AdminLayout>
  );
}
```

次に、AdminLayoutのメニューにNext.jsのルーターを組み込んでいきます:

```tsx
// layouts/adminLayout.tsx
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
        <div className={styles.logo}/>
        <Menu theme="dark" mode="inline" selectedKeys={[router.pathname]}>
          <Menu.Item key="/" icon={<DashboardOutlined/>}>
            <Link href="/">ダッシュボード</Link>
          </Menu.Item>
          <Menu.Item key="/users" icon={<UserOutlined/>}>
            <Link href="/users">利用者</Link>
          </Menu.Item>
          <Menu.Item key="/equipments" icon={<LaptopOutlined/>}>
            <Link href="/equipments">備品</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className={styles.siteLayoutBackground} style={{ padding: 0 }}>
          {collapsed ? (
            <MenuUnfoldOutlined className={styles.trigger} onClick={toggle}/>
          ) : (
            <MenuFoldOutlined className={styles.trigger} onClick={toggle}/>
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
```

ポイントとしては、

- `<Menu>`コンポーネントの`selectedKeys`に現在ページの`pathname`を与えるようにする
- `<Menu.Item>`内のchildrenは、`next/link`の`<Link>`コンポーネントにする

です。

あとは、3つの画面を実装していきます:

```tsx
// pages/index.tsx
export default function Home() {
  return "ダッシュボード";
}

// pages/users.tsx
export default function Users() {
  return "利用者";
}

// pages/equipments.tsx
export default function Equipments() {
  return "備品";
}
```

これでAnt DesignのメニューとNext.jsのRouterが統合できました。

次の動画ように、URLとメニューが連動するような動作になっているはずです:

https://user-images.githubusercontent.com/855338/126248344-fc6cd155-95f0-4a63-b12c-ee7deb205c39.mp4

## 利用者画面に一覧テーブルを表示する

ここでは、`/users`にて利用者一覧をテーブル表示するのをやっていきます。

Ant Designの`<Table>`コンポーネントを用います。

いきなり完成形ですが、pages/users.tsxの中身は次のようにします。

```tsx
// pages/users.tsx
import { Avatar, PaginationProps, Table } from "antd";
import { TablePaginationConfig } from "antd/es/table/interface";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const { Column } = Table;

export default function Users() {
  const router = useRouter();
  const [data, setData] = useState<ReadonlyArray<any>>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationProps>();

  // URLのpageクエリーパラメータをもとに、APIから所定のページを取ってくるようにします。
  // pageパラメータが変化するごとに発動します。
  useEffect(
    () => fetchUsers((router.query.page as any) ?? 0),
    [router.query.page]
  );

  // これは、ページネーションのUIをクリックしたときに発動します。
  function handleChange({ current = 0 }: TablePaginationConfig) {
    router.push({ pathname: router.pathname, query: { page: current } });
  }

  // ユーザーのダミーデータを提供してくれるAPI、ReqResからデータをお借りします。
  function fetchUsers(page: number = 1) {
    setLoading(true);
    fetch(`https://reqres.in/api/users?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
        setPagination({
          total: data.total,
          pageSize: data.per_page,
          current: data.page,
        });
        setLoading(false);
      });
  }

  return (
    <Table
      rowKey="id"
      dataSource={data}
      loading={loading}
      pagination={pagination}
      onChange={handleChange}
    >
      <Column title="ID" dataIndex="id"/>
      <Column
        title="Photo"
        dataIndex="avatar"
        render={(x) => <Avatar src={x}/>}
      />
      <Column title="First Name" dataIndex="first_name"/>
      <Column title="Last Name" dataIndex="last_name"/>
      <Column title="Email" dataIndex="email"/>
    </Table>
  );
}
```

これを実装すると次の動画のように、ページネーションのUIを操作したときにデータがロードされたり、URLに`page`パラメータを指定して直接アクセスしたときに該当のページが表示されるようになります。

https://user-images.githubusercontent.com/855338/126255802-58b6fa8f-f04e-447e-8aee-98a6c3770978.mp4

## UIを日本語化する

ここでは、UIを日本語化していきます。

日本語化するには、`ConfigProvider`に日本語翻訳データ`"antd/lib/locale/ja_JP"`を渡すだけです:

```tsx
// pages/_app.tsx
import { ConfigProvider } from "antd";
import jaJP from "antd/lib/locale/ja_JP";

// ...

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider locale={jaJP}>
      <Component {...pageProps} />
    </ConfigProvider>
  );
}
```

ためしにフォームを作って確認します:

```tsx
// pages/equipments/new.tsx
import { Button, Form, Input } from "antd";

const { Item } = Form;

export default function New() {
  return (
    <Form>
      <Item name="name" label="名前" rules={[{ required: true }]}>
        <Input />
      </Item>
      <Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          保存
        </Button>
      </Item>
    </Form>
  );
}
```

これでAnt Designのコンポーネントが出すメッセージが日本語されます:

https://user-images.githubusercontent.com/855338/126418055-9849a710-704a-4c44-8170-075111fd0b17.mp4

翻訳されるのはAnt Designのコンポーネントのメッセージだけのようで、アプリ固有の翻訳はAnt Design自体はサポートしていないようです。
