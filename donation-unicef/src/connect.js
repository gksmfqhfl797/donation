

import IconService, {
    IconConverter,
    IconBuilder,
    IconAmount
  } from "icon-sdk-js";

  

  
export default class Connect{
    constructor() {
        const { HttpProvider } = IconService;

        //mainnet
        this.provider = new HttpProvider("https://wallet.icon.foundation/api/v3");
        this.scoreAddress = "cx4dd21c1429a616e47940583a1287d5c0e424efbb";
        this.nid = "0x1";


        //testnet
        // this.provider = new HttpProvider("https://bicon.net.solidwallet.io/api/v3");
        // this.scoreAddress = "cxd8357c63ad5020db68ce4473ab21fc6b52791fc4";
        // this.nid = "0x3";

        
        this.iconService = new IconService(this.provider);
        
    }
    donate = async (address) =>{
      console.log(address)
      const { IcxTransactionBuilder } = IconBuilder;
      const networkId = IconConverter.toBigNumber(1);
      const transaction = new IcxTransactionBuilder()
          .from(address.address)
          .to(this.scoreAddress)
          .value(IconAmount.of(10, IconAmount.Unit.ICX).toLoop())
          .stepLimit(IconConverter.toHex(1000000))
          .timestamp((new Date()).getTime() * 1000)
          .nid(networkId)
          .version(IconConverter.toHex(3))
          .build();
      const rawTransaction = IconConverter.toRawTransaction(transaction);
      return rawTransaction
    }
      checkTransaction = param =>
      new Promise(resolve => {
        let timer;
        const checkTx = tx => {
          const transactionResult = this.iconService.getTransactionResult(tx);
          if (transactionResult) {
            clearInterval(timer);
            resolve(transactionResult.execute());
          } else {
            clearInterval(timer);
            alert(transactionResult.failure.message);
          }
        };
        timer = setInterval(() => {
          checkTx(param);
        }, 5000);
      });
  

       requestAddress = () => {
        return new Promise((resolve, reject) => {
          const listenerTimeout = setTimeout(() => {
            window.removeEventListener("ICONEX_RELAY_RESPONSE", eventHandler, false);
            reject("timeout");
          }, 10000);
          window.addEventListener("ICONEX_RELAY_RESPONSE", eventHandler, false);
          window.dispatchEvent(
            new CustomEvent("ICONEX_RELAY_REQUEST", {
              detail: {
                type: "REQUEST_ADDRESS"
              }
            })
          );
          function eventHandler(event) {
            const { type, payload } = event.detail;
            if (type === "RESPONSE_ADDRESS") {
              window.removeEventListener(
                "ICONEX_RELAY_RESPONSE",
                eventHandler,
                false
              );
              clearTimeout(listenerTimeout);
              resolve(payload);
              console.log(payload);
            }
          }
        });
      }
      
     requestJsonRpc =(rawTransaction)=> {
        return new Promise(resolve => {
          window.removeEventListener("ICONEX_RELAY_RESPONSE", eventHandler, false);
          window.addEventListener("ICONEX_RELAY_RESPONSE", eventHandler, false);
          window.dispatchEvent(
            new CustomEvent("ICONEX_RELAY_REQUEST", {
              detail: {
                type: "REQUEST_JSON-RPC",
                payload: {
                  jsonrpc: "2.0",
                  method: "icx_sendTransaction",
                  params: rawTransaction,
                  id: new Date().getTime()
                }
              }
            })
          );
          function eventHandler(event) {
            const { type, payload } = event.detail;
            if (type === "RESPONSE_JSON-RPC") {
              window.removeEventListener(
                "ICONEX_RELAY_RESPONSE",
                eventHandler,
                false
              );
              resolve(payload);
            }
          }
        });
      }
}