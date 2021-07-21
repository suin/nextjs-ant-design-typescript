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
