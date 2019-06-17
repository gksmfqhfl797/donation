import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom';
import Connect from './connect';

import './index.css'
export default class Index extends Component {
    constructor(props) {
        super(props)
      
        this.state = {
          address:''
        }
        this.connect = new Connect()
      }
    onClick = async () => {
        const address = await this.connect.requestAddress();
        if(address){
            this.setState({
                address
            })
        }
    }
    onChange=(e)=>{
        this.setState({
           message:e.target.value
        })
    }
    onClickSet = async ()=>{
        const transaction = await this.connect.donate({...this.state});
        const txHash = await this.connect.requestJsonRpc(transaction);
        const res = await this.connect.checkTransaction(txHash.result);
        if(res.status ===1 && res.txHash){
            this.ref.innerHTML = res.txHash
        }
    }

    render() {
        return (
            <Fragment>
            <div><p>어린이가 살기 좋은 세상은 모두가 살기 좋은 세상입니다</p> <p>당신의 아이콘으로 살기 좋은 세상을 만들어주세요</p>
            <div><button onClick={this.onClick}>지갑선택</button> 
            <button onClick={this.onClickSet}>10ICX 기부하기</button></div></div>
            </Fragment>
        )
    }
}

ReactDOM.render(<Index />, document.getElementById('root'));

;
