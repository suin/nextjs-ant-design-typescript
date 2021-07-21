import { ConfigProvider } from "antd";
import "antd/dist/antd.css";
import jaJP from "antd/lib/locale/ja_JP";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import "../styles/globals.css";

const AdminLayout = dynamic(() => import("../layouts/adminLayout"), {
  ssr: false,
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider locale={jaJP}>
      <AdminLayout>
        <Component {...pageProps} />
      </AdminLayout>
    </ConfigProvider>
  );
}
