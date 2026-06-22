import fs from 'fs/promises';

const readJsonFile = async () => {
    const rawData = await fs.readFile('wiki.txt', 'utf8');
    const terms = rawData.split('\n');
    return removeDuplicatesFromStringsArray(terms);

}

const removeDuplicatesFromStringsArray = (array) => {
    return [...new Set(array)];
}

const main = async () => {
    console.log((await readJsonFile())) ;


}
main()

