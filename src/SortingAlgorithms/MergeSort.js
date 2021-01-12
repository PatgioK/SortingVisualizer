

    mergeSort = async () => {
        console.log('start mergesort');
        const arry = this.state.array.slice();
        const auxArray = this.state.array.slice();

        await this.mergeSortHelper(arry, auxArray, 0, arry.length - 1);

    }

    mergeSortHelper = async (arry, auxArray, start, end) => {
        console.log('start mergesorthelper');
        if (start === end) {
            return;
        }

        const middle = Math.floor((start + end) / 2);
        await this.mergeSortHelper(arry, auxArray, start, middle);
        await this.mergeSortHelper(arry, auxArray, middle + 1, end);
        await this.doMerge(arry, auxArray, start, middle, end);

    }

    doMerge = async (arry, auxArray, start, middle, end) => {
        console.log('start doMerge');
        let a = start; // Arry start
        let b = start; // auxArray start
        let c = middle + 1; // midStart

        while (b <= middle && c <= end) {
            arry[b].color = SECONDARY_COLOR;  // change color of comparing bars
            arry[c].color = SECONDARY_COLOR;

            if (auxArray[b] <= auxArray[c]) {

                arry[a] = auxArray[b];
                this.setState({ array: arry });
                sleep(ANIMATION_SPEED_MS);

                arry[a].color = PRIMARY_COLOR;  // change color of comparing bars
                arry[c].color = PRIMARY_COLOR;

                a++;
                b++;
            } else {
                arry[a] = auxArray[c];
                this.setState({ array: arry });
                sleep(ANIMATION_SPEED_MS);

                arry[b].color = PRIMARY_COLOR;  // change color of comparing bars
                arry[a].color = PRIMARY_COLOR;

                a++;
                c++;
            }
        }

        while (b <= middle) {
            arry[b].color = SECONDARY_COLOR;
            arry[a] = auxArray[b];
            this.setState({ array: arry });
            sleep(ANIMATION_SPEED_MS);
            arry[a].color = PRIMARY_COLOR;

            a++;
            b++;
        }

        while (c <= end) {
            arry[c].color = SECONDARY_COLOR;
            arry[a] = auxArray[c];
            this.setState({ array: arry});
            sleep(ANIMATION_SPEED_MS);

            arry[a].color = PRIMARY_COLOR;
            a++;
            c++;
        }


    }

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

