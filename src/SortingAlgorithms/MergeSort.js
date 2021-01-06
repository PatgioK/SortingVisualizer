
export function getMergeSortAnimations(array) {
    const animations = [];
    if(array.length <= 1) {
        return array;
    }
    const auxArray = array.slice();
    mergeSortHelper(array, 0, array.length - 1, auxArray, animations)
    return animations;
}

function mergeSortHelper(mainArray, start, end, auxArray, animations) {
    if(start === end) {
        return;
    }
    const middle = Math.floor((start + end) / 2);
    mergeSortHelper(auxArray, start, middle, mainArray, animations);
    mergeSortHelper(auxArray, middle + 1, end, mainArray, animations);
    doMerge(mainArray, start, middle, end, auxArray, animations);
}

function doMerge(mainArray, start, middle, end, auxArray, animations){
    let a = start;
    let b = start;
    let c = middle + 1;
    while(b <= middle && c <= end) {
        // These are the values we are comparing; push once to change color, push second time to revert color.
        animations.push([b, c]);
        animations.push([b, c]);

        if(auxArray[b] <= auxArray[c]) {
            // We overwrite the value at a in the original array with value at index b in the auxiliary array.
            animations.push([a, auxArray[b]]);
            mainArray[a++] = auxArray[b++];
        } else {
            // We overwrite the value at a in the original array with the value at c in the auxiliary array.
            animations.push([a, auxArray[c]]);
            mainArray[a++] = auxArray[c++];
        }
    }

    while(b <= middle) {
        // These are the values we are comparing; push once to change color, push second time to revert color.
        animations.push([b, b]);
        animations.push([b, b]);

        // We overwrite the value at a in the original array with the value b in the auxiliary array.
        animations.push([a, auxArray[b]]);
        mainArray[a++] = auxArray[b++];
    }

    while(c <= end) {
        // These are the values we are compaing; we push once to change color, push second time to revert color.
        animations.push([c, c])
        animations.push([c, c])

        // We overwrite the value at a in the original array with the value c in the auxiliary array.
        animations.push([a, auxArray[c]]);
        mainArray[a++] = auxArray[c++];
    }
}

