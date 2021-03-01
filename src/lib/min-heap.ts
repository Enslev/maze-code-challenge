export class MinHeap<T> {
    public heap: Node<T>[];

    constructor() {
        this.heap = [];
    }

    insert(key: number, value: T) {
        this.heap.push(new Node(key, value));
        this.bubbleUp(this.heap.length - 1);
    }

    pop(): Node<T> | undefined {
        this.swap(0, this.heap.length - 1);
        const toReturn = this.heap.pop();
        this.bubbleDown(0);
        return toReturn;
    }

    find(findFunc: (element: Node<T>) => boolean) {
        const found = this.heap.find(findFunc);
        return found ? {
            index: this.heap.indexOf(found),
            key: found.key,
        } : undefined;
    }

    update(index: number, key: number, value: Partial<T>) {
        if (index >= this.heap.length) {
            return;
        }

        const current = this.heap[index];

        const oldKey = current.key;
        current.key = key;
        Object.assign(current.value, value);

        if (key > oldKey) {
            this.bubbleDown(index);
        }

        if (key < oldKey) {
            this.bubbleUp(index);
        }
    }

    private bubbleUp(index: number) {
        const parentIndex = Math.floor((index - 1) / 2);
        const parent = this.heap[parentIndex];
        const toCheck = this.heap[index];

        if (index > 0 && toCheck.key < parent.key) {
            this.swap(index, parentIndex)
            this.bubbleUp(parentIndex);
        }
    }

    private bubbleDown(index: number) {
        const leftChildIndex = (2 * index) + 1;
        const rightChildIndex = (2 * index) + 2;

        if (leftChildIndex < this.heap.length && this.heap[index].key > this.heap[leftChildIndex].key) {
            if (rightChildIndex < this.heap.length && this.heap[leftChildIndex].key > this.heap[rightChildIndex].key) {
                this.swap(index, rightChildIndex);
                this.bubbleDown(rightChildIndex);
                return;
            }

            this.swap(index, leftChildIndex);
            this.bubbleDown(leftChildIndex);
            return;
        }

        if (rightChildIndex < this.heap.length && this.heap[index].key > this.heap[rightChildIndex].key) {
            this.swap(index, rightChildIndex);
            this.bubbleDown(rightChildIndex);
            return;
        }
    }

    private swap(i1: number, i2: number) {
        const temp = this.heap[i1];
        this.heap[i1] = this.heap[i2];
        this.heap[i2] = temp;
    }
}

export class Node<T> {
    public key: number;
    public value: T;

    constructor(key: number, value: T) {
        this.key = key;
        this.value = value;
    }
}