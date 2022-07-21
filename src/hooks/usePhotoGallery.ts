//importing the various hooks and utilities
import { useState, useEffect } from 'react';
import { isPlatform } from '@ionic/react';

import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { Capacitor } from '@capacitor/core';
//


//1.1usePhotoGallery hook exposes a method called takePhoto, which in turn calls into Capacitor's getPhoto method
export function usePhotoGallery() {

    const [photos, setPhotos] = useState<UserPhoto[]>([]); //2.2define a state variable to store the array of each photo captured with the Camera

    const takePhoto = async () => {
        const photo = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100,
        });

        //2.3When the camera is done taking a picture, the resulting Photo returned from Capacitor will be stored in the photo variable. 
        //create a new photo object and add it to the photos state array. 
        //We make sure we don't accidently mutate the current photos array by making a new array, 
        //and then call setPhotos to store the array into state. 
        //Update the takePhoto method and add this code after the getPhoto call
        const fileName = new Date().getTime() + '.jpeg';
        const newPhotos = [
            {
                filepath: fileName,
                webviewPath: photo.webPath,
            },
            ...photos,
        ];
        setPhotos(newPhotos);

    };

    return {
        photos,//2.4
        takePhoto,
    };
}

//2.1create a new type to define our Photo, which will hold specific metadata
export interface UserPhoto {
    filepath: string;
    webviewPath?: string;
}