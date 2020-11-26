import React, { useState, useEffect } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';
import { useVT } from 'virtualizedtableforantd4';
import { nanoid } from 'nanoid';
import { useDebouncedCallback } from 'use-debounce';

// import style from './Editable Rows.css';

interface Item {
  key: string;
  name: string;
  age: number;
  address: string;
}

const originData: Item[] = [];
for (let i = 0; i < 10; i++) {
  originData.push({
    key: nanoid(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
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

  const handleScroll = (event: any) => {
    console.log('dfgdgf22d')

    let maxScroll = event.target.scrollHeight - event.target.clientHeight;
    let currentScroll = event.target.scrollTop;
    if (currentScroll === maxScroll) {
       // load more data
      const newData = [];
      for (let i = 0; i < 10; i++) {
              newData.push({
              key: nanoid(),
              name: `Wen ${i}`,
              age: 99,
              address: `Tokyo, Japan. ${i}`,
          });
     }
     setData([...data, ...newData]) ;
      
     //event.target.scrollHeight =  event.target.scrollHeight + 5; 
    }
  };

//   const debounced = useCallback(debounce(handleScroll, 1000), []);
//   const debounced = useRef(debounce(handleScroll, 300)).current;
    // const debounced = debounce(handleScroll, 300);
const debounced = useDebouncedCallback(
    // function
    (event) => {
        handleScroll(event);
    },
    // delay in ms
    1000
    );

  useEffect(() => {
    let tableContent = document.querySelector('.ant-table-body');
    tableContent?.addEventListener('scroll', (event: any) => {
        // debounced(event);
        debounced.callback(event);
        // handleScroll(event)
        // throttle(() => {
        //     console.log('dfgdgfd')
        //     handleScroll(event)
        // }, 100);
    })
    return () => tableContent?.removeEventListener('scroll', debounced.callback);
  })

  const isEditing = (record: Item) => record.key === editingKey;

  const edit = (record: Item) => {
    form.setFieldsValue(Object.assign({}, { name: '', age: '', address: ''}, record));
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;

      const newData = [...data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
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
      title: 'operation',
      dataIndex: 'operation',
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <button onClick={() => save(record.key)} style={{ marginRight: 8 }}>
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

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });





  /*******************************/
  const y = 500;
  const [vt, setComponent] = useVT(() => ({ scroll: { y }, debug: true } ));
  setComponent({
    body: {
      cell: EditableCell,
    },
  });
  /*******************************/


  return (
    <Form form={form} component={false}>
      <Table
        // components={{
        //   body: {
        //     cell: EditableCell,
        //   },
        // }}
        components={vt}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        scroll={{ y }} // !!!!!!!!!!!!!!!
        // pagination={{
        //   onChange: cancel,
        // }}
        pagination={false}
      />
    </Form>
  );
};

export default EditableTable;