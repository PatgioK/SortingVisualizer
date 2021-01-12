
export function getInsertionSortAnimations(array) {
    const animations = [];
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        animations.push(i);
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            j = j - 1;
        }

        array[j + 1] = key;
        animations.push(j + 1);
    }



    return animations;
}