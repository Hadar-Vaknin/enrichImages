import fs from 'fs/promises';
import fs2 from 'fs';
import fetch from  'node-fetch';
import { config }  from '../config/index.js';

export const removeDuplicatesFromObjectsArray = (array) => {
    try {
        return Array.from(new Set(array.map(obj => JSON.stringify(obj))))
        .map(str => JSON.parse(str));
    } catch (error) {
        console.error(`Error occured while saving documents to json file. error: ${error}`);
    }
}

export const removeDuplicatesFromStringsArray = (array) => {
    return [...new Set(array)];
}

const saveContentToFile = async (content, path) => {
    const chunkSize = 1000; 
    const stream = fs2.createWriteStream(path, { flags: 'a' }); 

    for (let i = 0; i < Object.keys(content).length; i += chunkSize) {
      const chunk = {};
    
      Object.keys(content).slice(i, i + chunkSize).forEach(key => {
        chunk[key] = content[key];
      });
      stream.write(JSON.stringify(chunk));
    }
    stream.end();
}

export const saveImagesDocuments = async (documents, filepath) => {
    documents.images = removeDuplicatesFromObjectsArray(documents.images);
    await saveContentToFile(documents, filepath);
}

export const downloadImage = async (url, filepath) => {
    const response = await fetch(url);

    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();

    await fs.writeFile(filepath, Buffer.from(arrayBuffer));
}

export const getSearchTerms = async (filepath) => {
    
    const rawData = await fs.readFile(filepath, 'utf8');
    const terms = rawData.split('\n');
    const lowercaseTerms = terms.map(string => {
        return string.toLowerCase();
    });

    return removeDuplicatesFromStringsArray(lowercaseTerms);
}

export const sleep = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

export const createDocForImage = (imageObj, name, imagesArray) => {
    imagesArray.push({ name, tags: imageObj.tags.split(', ') })
}