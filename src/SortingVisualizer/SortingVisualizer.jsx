import React from "react";
import "./SortingVisualizer.css";
import { setTimeout } from "timers";

// TODO: move algos to separate file.
//import { mergeSortHelper } from "../SortingAlgorithms/MergeSort";

// Original color of the array bars.
const PRIMARY_COLOR = "aqua";

// Color for when we are comparing array bars.
const SECONDARY_COLOR = "lightgreen";

// Color for sorted final bar.
const TERTIARY_COLOR = "gold"

// Speed of the animation in ms.
const ANIMATION_SPEED_MS = 3;

// Lower bound height for bars
const LOWER_INTERVAL = 15;

// Upper bound height for bars.
const UPPER_INTERVAL = 400;

// Number of array bars.
const NUMBER_OF_BARS = 129;

// Javascript sleep() best practice found at:
// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep/39914235#39914235
const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

// Function to move elements from one index to another.
function arraymove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}

// Function to swap elements in an array.
function swapper(arr, leftIdx, rightIdx) {
    console.log('swapper  left:' + leftIdx + ' right:' + rightIdx);
    var temp = arr[leftIdx];
    arr[leftIdx] = arr[rightIdx];
    arr[rightIdx] = temp;
}

// Generates random Integer in given interval.
// From https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomIntfromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export default class SortingVisualizer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            array: []
        };
    }

    // React function runs first time component is rendered, client side only.
    componentDidMount() {
        this.resetArray();
    }

    // Generates a new array and sets it to the state.
    resetArray() {
        const array = [];
        // let numBars = randomIntfromInterval(LOWER_INTERVAL, UPPER_INTERVAL);
        for (let i = 0; i < NUMBER_OF_BARS; i++) {
            array.push({
                height: randomIntfromInterval(LOWER_INTERVAL, UPPER_INTERVAL),
                color: PRIMARY_COLOR
            });
        }
        this.setState({ array });
    }

    heapSort = async () => {
        const arry = this.state.array.slice();
        let size = arry.length;

        await this.buildMaxHeap(arry, size);

        await this.heapPop(arry, size);
    }

    heapPop = async (arry, size) => {

        for (let i = size - 1; i >= 0; i--) {
            arry[0].color = TERTIARY_COLOR;
            swapper(arry, 0, i);
            this.setState({ array: arry});
            await this.maxHeapify(arry, 0, i);
        }
    }

    // Converts A[1..n] into a max heap
    // for i = n/2 down to 1
    // do maxHeapify (A, i)
    buildMaxHeap = async (arry, size) => {
        console.log('buildMaxHeap size:' + size);

        // -1 here cause array indexes start at 0
        for (let i = Math.floor(size / 2) - 1; i >= 0; i--) {
            // console.log(i);
            await this.maxHeapify(arry, i, size);
        }
    }

    // root of tree: first element (i = 1)
    // parent(i) = i/2;
    // left(i) = 2i;
    // right(i) = 2i + 1;
    maxHeapify = async (arry, i, size) => {
        let maxIdx;
        let leftIdx = 2 * i;
        let rightIdx = 2 * i + 1;
        if (i === 0) {
            leftIdx = 1;
            rightIdx = 2;
        }
        console.log('maxHeapify:  i:' + i + ' leftIdx:' + leftIdx + ' rightIdx:' + rightIdx);

        if (rightIdx < size) {
            if (arry[leftIdx].height > arry[rightIdx].height) {
                maxIdx = leftIdx;
            } else {
                maxIdx = rightIdx;
            }
        } else if (leftIdx < size) {
            maxIdx = leftIdx;

        } else {
            return;
        }

        if (arry[i].height < arry[maxIdx].height) {
            arry[i].color = SECONDARY_COLOR;
            arry[maxIdx].color = SECONDARY_COLOR;
            swapper(arry, i, maxIdx);
            this.setState({ array: arry});
            await sleep(ANIMATION_SPEED_MS);

            arry[i].color = PRIMARY_COLOR;
            arry[maxIdx].color = PRIMARY_COLOR;
            this.setState({ array: arry});
            await sleep(ANIMATION_SPEED_MS);

            await this.maxHeapify(arry, maxIdx, size);
        }
        return;
    }

    // Insertion sort algorithm 
    insertionSort = async () => {
        const { array } = this.state;

        for (let i = 0; i < array.length; i++) {
            array[i].color = SECONDARY_COLOR;
            this.setState(array);
            await sleep(ANIMATION_SPEED_MS);
            var sortedIndex = array.findIndex(
                (el) => el.height >= array[i].height
            );
            arraymove(array, i, sortedIndex);
            array[sortedIndex].color = TERTIARY_COLOR;
            this.setState(array);

            await sleep(ANIMATION_SPEED_MS);
        }
    }

    // Bubble sort algorithm
    bubbleSort = async () => {
        const { array } = this.state;
        console.log(array);
        await sleep(ANIMATION_SPEED_MS / 2);
        for (let i = 0; i < array.length - 1; i++) {
            for (let j = 0; j < array.length - 1 - i; j++) {
                array[j].color = SECONDARY_COLOR;
                array[j + 1].color = SECONDARY_COLOR;
                await sleep(ANIMATION_SPEED_MS / 10);
                if (array[j + 1].height <= array[j].height) {
                    arraymove(array, j, j + 1);
                }
                this.setState(array);
                await sleep(ANIMATION_SPEED_MS / 10);
                array[j].color = PRIMARY_COLOR;
                array[j + 1].color = TERTIARY_COLOR;
            }
        }
        array[0].color = TERTIARY_COLOR;  // Change last bar to finished color.
        await sleep(ANIMATION_SPEED_MS / 10);
        this.setState(array);
        console.log(array);
    }

    mergeSort = async () => {
        const { array } = this.state;
        let arry = array.slice();
        let auxArray = arry.slice();

        await this.mergeSortHelper(arry, auxArray, 0, arry.length - 1);
        for (let i = 0; i < array.length; i++) {
            arry[i].color = TERTIARY_COLOR;
        }
        this.setState({ array: arry });
    }

    mergeSortHelper = async (arry, auxArray, start, end) => {
        if (start === end) {
            return;
        }
        const middle = Math.floor((start + end) / 2);

        await this.mergeSortHelper(arry, auxArray, start, middle);
        await this.mergeSortHelper(arry, auxArray, middle + 1, end);
        await this.doMerge(arry, auxArray, start, middle, end);
    }

    doMerge = async (arry, auxArray, start, middle, end) => {
        // const { array } = this.state;
        let a = start;  //arry start
        let b = start;  //auxArray start
        let c = middle + 1; //mid start

        while (b <= middle && c <= end) {
            if (auxArray[b].height <= auxArray[c].height) {
                arry[a] = auxArray[b];
                this.setState({ array: arry });
                await sleep(ANIMATION_SPEED_MS);
                a++;
                b++;
            } else {
                arry[a] = auxArray[c];
                this.setState({ array: arry });
                await sleep(ANIMATION_SPEED_MS);
                a++;
                c++;
            }
        }

        while (b <= middle) {
            arry[a] = auxArray[b];
            this.setState({ array: arry });
            await sleep(ANIMATION_SPEED_MS);
            a++;
            b++;
        }

        while (c <= end) {
            arry[a] = auxArray[c];
            this.setState({ array: arry });
            await sleep(ANIMATION_SPEED_MS);
            a++;
            c++;
        }

        // Set auxArray to be the same as arry before next recursive call.
        for (let i = 0; i < arry.length; i++) {
            auxArray[i] = arry[i];
        }
    }

    //console.log(JSON.stringify(obj));

    // Quicksort implementation from:
    // https://medium.com/@kasho/quick-sort-algorithm-in-javascript-5432a06e5b7a

    quickSort = async () => {
        let arr = this.state.array.slice();

        await this.quickSortHelper(arr, 0, arr.length - 1);
        console.log('quicksort done');
        for (let i = 0; i < arr.length; i++) {
            arr[i].color = TERTIARY_COLOR;
        }
        this.setState({ array: arr });
        await sleep(ANIMATION_SPEED_MS);
    }

    partition = async (arr, left, right) => {
        const pivotIdx = Math.floor((left + right) / 2);
        const pivotValue = arr[pivotIdx].height;
        let i = left;
        let j = right;

        arr[pivotIdx].color = SECONDARY_COLOR;
        this.setState({ array: arr });
        await sleep(ANIMATION_SPEED_MS);

        while (i <= j) {
            while (arr[i].height < pivotValue) {
                i++;
            }

            while (arr[j].height > pivotValue) {
                j--;
            }

            if (i <= j) {
                console.log(JSON.stringify(arr));
                swapper(arr, i, j);
                console.log(JSON.stringify(arr));
                this.setState({ array: arr });
                await sleep(ANIMATION_SPEED_MS);
                i++;
                j--;
            }
        }

        for (let i = 0; i < arr.length; i++) {
            arr[i].color = PRIMARY_COLOR;
        }

        this.setState({ array: arr });
        await sleep(ANIMATION_SPEED_MS);

        return i;
    }

    quickSortHelper = async (arr, left, right) => {
        if (arr.length < 2) {
            return;
        }

        const index = await this.partition(arr, left, right);

        if (left < index - 1) {
            await this.quickSortHelper(arr, left, index - 1);
        }
        if (right > index) {
            await this.quickSortHelper(arr, index, right);
        }
        return;

    }

    arrayLog = async () => {
        console.log(this.state.array);
    }

    render() {
        const { array } = this.state;

        return (
            // Arrow function to use "this" context in the resetArray callback function: this.setState({array}).
            // React.Fragment allows us to return multiple elements under the same DOM.
            <React.Fragment>
                <div className="button-bar">
                    <button onClick={() => this.resetArray()}>Generate Array</button>
                    <button onClick={() => this.insertionSort()}>Insertion Sort</button>
                    <button onClick={() => this.mergeSort()}>Merge Sort</button>
                    <button onClick={() => this.quickSort()}>Quick Sort</button>
                    <button onClick={() => this.heapSort()}>Heap Sort</button>
                    <button onClick={() => this.bubbleSort()}>Bubble Sort</button>
                    {/* <button onClick={() => this.arrayLog()}>Array Log</button> */}
                </div>
                <div className="array-container">
                    {array.map((item, idx) => (
                        <div
                            className="array-bar"
                            key={idx}
                            // $ dollarsign makes a css variable???
                            style={{
                                backgroundColor: `${item.color}`,
                                height: `${item.height}px`
                            }}
                        ></div>
                    ))}
                </div>
            </React.Fragment>
        );
    }
}