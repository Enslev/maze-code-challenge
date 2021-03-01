export function chunkArray(myArray: any[], chunk_size: number){
    const arrayLength = myArray.length;
    const tempArray = [];
    
    for (let index = 0; index < arrayLength; index += chunk_size) {
        tempArray.push(myArray.slice(index, index+chunk_size));
    }

    return tempArray;
}