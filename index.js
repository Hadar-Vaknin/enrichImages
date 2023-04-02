import axios from 'axios';
import { config }  from './config/index.js';
import { saveImagesDocuments, downloadImage, getSearchTerms, sleep, createDocForImage} from './utils/index.js'

let documents = {images: [] };

const images1 = [];
const images2 = [];
const images3 = [];
const images4 = [];
const images5 = [];
const images6 = [];
const images7 = [];

const searchImages = async (keyWord, key, imagesArray) => {
    try {
        const res = await axios.get(`${config.pixabay.url}?q=${keyWord}&key=${key}&per_page=${config.pixabay.imagesPerPage}&safesearch=true`);
        const imagesObj = res.data?.hits;

        await Promise.all(imagesObj.map(async (image) => {
            try {
                const imageName = image.previewURL.split('/').pop();
                await downloadImage(image.webformatURL, `${config.output.imagesDir}/${imageName}`);
                createDocForImage(image, imageName, imagesArray);
            } catch (error) {
                console.log(`Error in download image, image: ${image?.name} error:`, error);
            }
        }));

    } catch (error) {
        console.error(`Error while searching images, error: ${error}. waiting 1 min.`);
        await sleep(60000);
        console.log('done waiting')
    }
}

const getImages = async (searchWords, key, imagesArray) => {
    for (const word of searchWords) {
        if(word[0] === '#') continue;
        console.log(word)
        await searchImages(word, key, imagesArray);
    }
    console.log(`key: ${key} finished.`)
}

const main = async () => {    
    let randomSearchWords = await getSearchTerms('40000-end.txt');
    const chunkSize = Math.ceil(randomSearchWords.length / 7); 

    const splittedArray = [];
    for (let i = 0; i < randomSearchWords.length; i += chunkSize) {
        splittedArray.push(randomSearchWords.slice(i, i + chunkSize)); 
    }
    const [array1, array2, array3, array4, array5, array6, array7 ] = splittedArray;

    console.log(array1.length, array2.length, array3.length, array4.length, array5.length, array6.length, array7.length)

    await Promise.allSettled([
        getImages(array1, config.pixabay.key1, images1),
        getImages(array2, config.pixabay.key2, images2),
        getImages(array3, config.pixabay.key3, images3),
        getImages(array4, config.pixabay.key4, images4),
        getImages(array5, config.pixabay.key5, images5),
        getImages(array6, config.pixabay.key6, images6),
        getImages(array7, config.pixabay.key7, images7),
    ]);

    documents.images = [...images1, ...images2, ...images3, ...images4, ...images5, ...images6, ...images7];
    await saveImagesDocuments(documents, config.output.fileDir)
}

main()

process.once('uncaughtException', async () => {
    documents.images = [...images1, ...images2, ...images3, ...images4, ...images5, ...images6, ...images7];
    await saveImagesDocuments(documents, config.output.fileDir)
});
  
process.once('SIGINT', () => { throw new Error() })