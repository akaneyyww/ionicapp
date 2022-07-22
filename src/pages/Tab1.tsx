import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton ,IonItem, IonLabel, IonIcon, IonToggle, IonFab, IonFabButton} from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import { bluetoothOutline } from 'ionicons/icons';
import { BleClient ,BluetoothLe  } from '@capacitor-community/bluetooth-le';

import { connectDevice } from '../hooks/connectDevice';

// export class connectBLE{
// device:any[]=[];
// ble:boolean=false;
// scanText:string="";

// ngOnInit(){

//     BleClient.initialize().then(()=>{
//         BleClient.isEnabled().then((res)=>{
// if(res){
//     this.ble = true;
// }else{
//     this.ble = false;
// }

//         })
//     })
// }

// }




const Tab1: React.FC = () => {

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
            {/* <IonButton slot="end">
              <IonItem>
                <IonLabel>
                  <IonIcon size="large" icon="bluetooth"></IonIcon>
                </IonLabel>
                <IonToggle onIonChange={e => toggleBle(e.detail.checked)} />
                <IonToggle onIonChange="toggleBle($event)"[(ngModel)]="ble"/>
              </IonItem>
            </IonButton> */}
          </IonToolbar>
        </IonHeader>
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => connectDevice()}>
            <IonIcon icon={bluetoothOutline}></IonIcon>
          </IonFabButton>
        </IonFab>
        <ExploreContainer name="Tab 1 page" />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;

