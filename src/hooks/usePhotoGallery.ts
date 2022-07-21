//importing the various hooks and utilities
import { useState, useEffect } from 'react';
import { isPlatform } from '@ionic/react';

import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { Capacitor } from '@capacitor/core';
//

//4.1defining a constant variable that will act as the key for the store
const PHOTO_STORAGE = 'photos';

//1.1usePhotoGallery hook exposes a method called takePhoto, which in turn calls into Capacitor's getPhoto method
export function usePhotoGallery() {

    const [photos, setPhotos] = useState<UserPhoto[]>([]); //2.2define a state variable to store the array of each photo captured with the Camera


    useEffect(() => {
        //5.2
        const loadSaved = async () => {
            const { value } = await Storage.get({ key: PHOTO_STORAGE });
          
            const photosInStorage = (value ? JSON.parse(value) : []) as UserPhoto[];
            // If running on the web...
            if (!isPlatform('hybrid')) {
              for (let photo of photosInStorage) {
                const file = await Filesystem.readFile({
                  path: photo.filepath,
                  directory: Directory.Data,
                });
                // Web platform only: Load the photo as base64 data
                photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
              }
            }
            setPhotos(photosInStorage);
          };
        loadSaved();
      }, []);


    const takePhoto = async () => {
        const photo = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100,
        });

        //3.1 +5.1
        const savePicture = async (photo: Photo, fileName: string): Promise<UserPhoto> => {
            let base64Data: string;
            // "hybrid" will detect Cordova or Capacitor;
            if (isPlatform('hybrid')) {
              const file = await Filesystem.readFile({
                path: photo.path!,
              });
              base64Data = file.data;
            } else {
              base64Data = await base64FromPath(photo.webPath!);
            }
            const savedFile = await Filesystem.writeFile({
              path: fileName,
              data: base64Data,
              directory: Directory.Data,
            });
          
            if (isPlatform('hybrid')) {
              // Display the new image by rewriting the 'file://' path to HTTP
              // Details: https://ionicframework.com/docs/building/webview#file-protocol
              return {
                filepath: savedFile.uri,
                webviewPath: Capacitor.convertFileSrc(savedFile.uri),
              };
            } else {
              // Use webPath to display the new image instead of base64 since it's
              // already loaded into memory
              return {
                filepath: fileName,
                webviewPath: photo.webPath,
              };
            }
          };

        //2.3When the camera is done taking a picture, the resulting Photo returned from Capacitor will be stored in the photo variable. 
        //create a new photo object and add it to the photos state array. 
        //We make sure we don't accidently mutate the current photos array by making a new array, 
        //and then call setPhotos to store the array into state. 
        //Update the takePhoto method and add this code after the getPhoto call
        const fileName = new Date().getTime() + '.jpeg';
        const savedFileImage = await savePicture(photo, fileName);
        const newPhotos = [savedFileImage, ...photos];
        setPhotos(newPhotos);

        //4.2 At the end of the takePhoto function, add a call to Storage.set() to save the Photos array.
        // By adding it here, the Photos array is stored each time a new photo is taken. 
        // This way, it doesn’t matter when the app user closes or switches to a different app - all photo data is saved.
        Storage.set({ key: PHOTO_STORAGE, value: JSON.stringify(newPhotos) });
    };


    const deletePhoto = async (photo: UserPhoto) => {
        // Remove this photo from the Photos reference data array
        const newPhotos = photos.filter((p) => p.filepath !== photo.filepath);
      
        // Update photos array cache by overwriting the existing photo array
        Storage.set({ key: PHOTO_STORAGE, value: JSON.stringify(newPhotos) });
      
        // delete photo file from filesystem
        const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
        await Filesystem.deleteFile({
          path: filename,
          directory: Directory.Data,
        });
        setPhotos(newPhotos);
      };

    

    // return {
    //     photos,//2.4
    //     takePhoto,
    // };
    return {
        deletePhoto,
        photos,
        takePhoto,
      };
}

//2.1create a new type to define our Photo, which will hold specific metadata
export interface UserPhoto {
    filepath: string;
    webviewPath?: string;
}

//3.2
export async function base64FromPath(path: string): Promise<string> {
    const response = await fetch(path);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject('method did not return a string');
        }
      };
      reader.readAsDataURL(blob);
    });
  }