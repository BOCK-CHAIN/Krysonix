export class LinkedHashSet {
  private map: Map<any, boolean>;

  constructor() {
    this.map = new Map(); // Using Map to maintain order and uniqueness
  }

  // Add an element to the set
  add(element: any) {
    if (!this.map.has(element)) {
      this.map.set(element, true); // Store element with a placeholder value
    }
  }

  // Check if the set contains an element
  contains(element: any): boolean {
    return this.map.has(element);
  }

  // Remove an element from the set
  remove(element: any) {
    this.map.delete(element);
  }

  // Delete the first element (based on insertion order)
  deleteFirst() {
    const firstKey = this.map.keys().next().value; // Get the first key
    if (firstKey !== undefined) {
      this.remove(firstKey);
    }
  }

  deleteLast() {
    if (this.size() > 0) {
      const lastElement = this.elements()[this.size() - 1];
      this.remove(lastElement);
    }
  }

  // Get the size of the set
  size(): number {
    return this.map.size;
  }

  // Check if the set is empty
  isEmpty(): boolean {
    return this.map.size === 0;
  }

  // Get all elements in insertion order
  elements(): any[] {
    return Array.from(this.map.keys());
  }

  // Clear all elements from the set
  clear() {
    this.map.clear();
  }

  // Iterate over elements
  forEach(callback: (element: any) => void) {
    for (const element of this.map.keys()) {
      callback(element);
    }
  }
}

