import * as dotenv from 'dotenv' 
dotenv.config()

export const config = {
    pixabay: {
        url:`https://pixabay.com/api/`,
        key1: '34800192-44e8e4755abe6736028e67957',
        key2: '34800224-e51ba68e2f1b5e9e8f7c821e8',
        key3: '34800336-8fee3ff36fdd297d640675949', 
        key4: '34587616-baaa6416ae0bc275a01b27951',
        key5: '34861592-5c725116244674447b4a1e769',
        key6: '34861672-6371bd23c1d77b91a783ebcf8',
        key7: '34887295-5e97e17f921cf90fbf9e67964',
        imagesPerPage: 25
    },
    uploadImagesScript: {
        path: process.env.UPLOAD_IMAGES_PATH || '../uploadImages'
    }
}
