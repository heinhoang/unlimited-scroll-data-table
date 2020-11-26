import React from 'react';
import VirtualTable from './An';
import './App.css';
import 'antd/dist/antd.css';

// const columns = [
//   {
//     title: 'A',
//     dataIndex: 'key',
//     width: 150,
//   },
//   {
//     title: 'B',
//     dataIndex: 'key',
//   },
//   {
//     title: 'C',
//     dataIndex: 'key',
//   },
//   {
//     title: 'D',
//     dataIndex: 'key',
//   },
//   {
//     title: 'E',
//     dataIndex: 'key',
//     width: 200,
//   },
//   {
//     title: 'F',
//     dataIndex: 'key',
//     width: 100,
//   },
// ];
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
];
// const data = Array.from(
//   {
//     length: 100000,
//   },
//   (_, key) => ({
//     key,
//   }),
// );

const Data: any[] = [];
for (let i = 0; i < 100; i++) {
  Data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  });
}



class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: Data
    }
  }

  componentDidMount() {
    var tableContent = document.querySelector('.virtual-grid');
    tableContent?.addEventListener('scroll', (event: any) => {
      let maxScroll = event.target.scrollHeight - event.target.clientHeight;
      let currentScroll = event.target.scrollTop;
      if (currentScroll === maxScroll) {
         // load more data
        const newData = [];
        for (let i = 0; i < 5; i++) {
        newData.push({
          key: i,
          name: `Wen ${i}`,
          age: 99,
          address: `Tokyo, Japan. ${i}`,
        });
          
        this.setState({
          ...this.state,
          data: [...this.state.data, ...newData],
        });  
       }
        
       //event.target.scrollHeight =  event.target.scrollHeight + 5; 
      }
    })

  }

  render() {
    return (
      <div className="App">
        <VirtualTable
          columns={columns}
          dataSource={this.state.data}
          scroll={{
            y: 300,
          }}
        />
      </div>
    );
  }

}

export default App;
