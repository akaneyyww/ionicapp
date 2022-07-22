import { BleClient, numbersToDataView, numberToUUID } from '@capacitor-community/bluetooth-le';

const SMART_DEVICE = 'F1:50:EA:C9:94:E4';

export async function connectDevice(): Promise<void> {
    try {
      await BleClient.initialize();


      const device = await BleClient.requestDevice(
        {
        
      }
      );
  
      await BleClient.requestLEScan(
        {
          //services: [SMART_DEVICE],
        },
        (result) => {
          console.log('received new scan result', result);
        }
      );
  
      setTimeout(async () => {
        await BleClient.stopLEScan();
        console.log('stopped scanning');
      }, 5000);
    } catch (error) {
      console.error(error);
    }
  }
