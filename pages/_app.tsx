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
