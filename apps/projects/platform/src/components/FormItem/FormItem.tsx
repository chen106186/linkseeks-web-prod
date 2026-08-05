import { Form, FormItemProps } from "antd";

function FormItem<values = any>(prosp: FormItemProps<values>) {
  return (
    <Form.Item
      labelAlign="left"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      {...prosp} className="w-full">

      {prosp.children}

    </Form.Item>
  );
}

export default FormItem