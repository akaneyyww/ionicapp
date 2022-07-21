
import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';

import { camera, trash, close } from 'ionicons/icons';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonActionSheet,
} from '@ionic/react';

import { usePhotoGallery } from '../hooks/usePhotoGallery';//1.2import the hook

const Tab2: React.FC = () => {
  const { photos, takePhoto } = usePhotoGallery(); //1.3get access to the takePhoto method by using the hook
  //2.5 back in the Tab2 component, get access to the photos


  //put the visual aspects of our app into <IonContent>

  //2.6Add a Grid component so that each photo will display nicely as photos are added to the gallery, 
  //and loop through each photo in the Photos array, adding an Image component (<IonImg>) for each. 
  //Point the src (source) to the photo’s path
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Photo Gallery</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonContent>

          <IonGrid>
            <IonRow>
              {photos.map((photo, index) => (
                <IonCol size="6" key={index}>
                  <IonImg src={photo.webviewPath} />
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>

          <IonFab vertical="bottom" horizontal="center" slot="fixed">
            <IonFabButton onClick={() => takePhoto()}>
              <IonIcon icon={camera}></IonIcon>
            </IonFabButton>
          </IonFab>
        </IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Tab 2 page" />
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
