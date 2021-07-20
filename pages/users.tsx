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

  useEffect(
    () => fetchUsers((router.query.page as any) ?? 0),
    [router.query.page]
  );

  function handleChange({ current = 0 }: TablePaginationConfig) {
    router.push({ pathname: router.pathname, query: { page: current } });
  }

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
      <Column title="ID" dataIndex="id" />
      <Column
        title="Photo"
        dataIndex="avatar"
        render={(x) => <Avatar src={x} />}
      />
      <Column title="First Name" dataIndex="first_name" />
      <Column title="Last Name" dataIndex="last_name" />
      <Column title="Email" dataIndex="email" />
    </Table>
  );
}
