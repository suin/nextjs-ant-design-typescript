import dynamic from "next/dynamic";

const AdminLayout = dynamic(() => import("../layouts/adminLayout"), {
  ssr: false,
});

export default function Home() {
  return <AdminLayout>コンテンツ</AdminLayout>;
}
