import axios from 'axios';
import { config }  from './config/index.js';
import { saveContentToFile, downloadImage, getSearchTerms, removeDuplicatesFromObjectsArray } from './utils/index.js'

let documents = {images: [] };

const images1 = [];
const images2 = [];
const images3 = [];
const images4 = [];
const images5 = [];
const images6 = [];
const images7 = [];

const createDocForImage = (imageObj, name, imagesArray) => {
    imagesArray.push({ name, tags: imageObj.tags.split(', ') })
}
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

const searchImages = async (keyWord, key, imagesArray) => {
    try {
        const res = await axios.get(`${config.pixabay.url}?q=${keyWord}&key=${key}&per_page=${config.pixabay.imagesPerPage}&safesearch=true`);
        const imagesObj = res.data?.hits;

        for (const image of imagesObj) {
            try {
                const imageName = image.previewURL.split('/').pop();
                await downloadImage(image.webformatURL, `${config.uploadImagesScript.path}/1/${imageName}`);
                createDocForImage(image, imageName, imagesArray);
            } catch (error) {
                console.log(`Error in download image, image: ${image}`)
            }

        }

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
    console.log("Key: " + key + "finished.")
}

const main = async () => {    
    let randomSearchWords = await getSearchTerms('1.txt');
    // randomSearchWords = randomSearchWords.slice(0,40000);
    const chunkSize = Math.ceil(randomSearchWords.length / 7); 

    const splittedArray = [];
    for (let i = 0; i < randomSearchWords.length; i += chunkSize) {
        splittedArray.push(randomSearchWords.slice(i, i + chunkSize)); // split the array into chunks and push them into the result array
    }

    const [array1, array2, array3, array4, array5, array6, array7 ] = splittedArray;

    console.log(array1.length, array2.length, array3.length, array4.length, array5.length, array6.length, array7.length)

    // await getImages(array1, config.pixabay.key1, images1),
    // await getImages(array2, config.pixabay.key2, images2),
    // await getImages(array3, config.pixabay.key3, images3),
    // await getImages(array4, config.pixabay.key4, images4),
    // await getImages(array5, config.pixabay.key5, images5),
    // await getImages(array6, config.pixabay.key6, images6),
    // await getImages(array7, config.pixabay.key7, images7),

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
    documents.images = removeDuplicatesFromObjectsArray(documents.images);
    await saveContentToFile(documents, `${config.uploadImagesScript.path}/1.json`);
}

main()

