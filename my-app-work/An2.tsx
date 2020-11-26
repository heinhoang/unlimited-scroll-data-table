import React, { useState, useEffect } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';
const originData: any[] = [];

for (let i = 0; i < 10; i++) {
  originData.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}: any) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');

  useEffect(() => {
    var tableContent = document.querySelector('.ant-table-content');
    tableContent?.addEventListener('scroll', (event: any) => {
        console.log('poppo')
      let maxScroll = event.target.scrollHeight - event.target.clientHeight;
      let currentScroll = event.target.scrollTop;
      if (currentScroll === maxScroll) {
         // load more data
        const newData = [];
        for (let i = 0; i < 5; i++) {
        newData.push({
          key: (new Date()).getTime(),
          name: `Wen ${i}`,
          age: 99,
          address: `Tokyo, Japan. ${i}`,
        });
          
        setData([...data, ...newData]) ;
       }
        
       //event.target.scrollHeight =  event.target.scrollHeight + 5; 
      }
    })
  })

  const isEditing = (record: any) => record.key === editingKey;

  const edit = (record: any) => {
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: any) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const rm = (key: any) => {
    setData(data.filter(item => item.key !== key));
  };

  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
      width: '25%',
      editable: true,
    },
    {
      title: 'age',
      dataIndex: 'age',
      width: '15%',
      editable: true,
    },
    {
      title: 'address',
      dataIndex: 'address',
      width: '40%',
      editable: true,
    },
    {
      title: 'edit',
      dataIndex: 'edit',
      render: (_: any, record: any) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <button
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </button>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <button>Cancel</button>
            </Popconfirm>
          </span>
        ) : (
          <button disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </button>
        );
      },
    },
    {
        title: 'delete',
        dataIndex: 'delete',
        render: (_: any, record: any) => {
          return (
            <button onClick={() => rm(record.key)}>
              Delete
            </button>
          );
        },
      },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record: any) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={false}
      />
    </Form>
  );
};

export default EditableTable;