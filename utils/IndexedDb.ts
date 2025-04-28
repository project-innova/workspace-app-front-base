class IndexedDb<T extends Record<string, any>> {
    private db: IDBDatabase | null = null;
    private readonly dbName: string;
    private readonly storeName: string;
    private readonly keyPath: string;

    private version: number;

    constructor(storeName: string, dbName: string, keyPath: string = 'key', version: number = 1) {
        this.storeName = storeName;
        this.dbName = dbName;
        this.keyPath = keyPath;
        this.version = version;
    }

    static async make<T extends Record<string, any>>(
        storeName: string,
        dbName: string,
        keyPath: string = 'key',
        version: number = 1
    ): Promise<IndexedDb<T>> {
        const db = new IndexedDb<T>(storeName, dbName, keyPath, version);
        await db.open();
        return db;
    }
    static async makeWithStores(
        dbName: string,
        stores: Array<{ name: string, options?: IDBObjectStoreParameters }>,
        version: number = 1
      ): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
          const request = indexedDB.open(dbName, version);

          request.onupgradeneeded = (event) => {
            const db = request.result;
            stores.forEach(store => {
              if (!db.objectStoreNames.contains(store.name)) {
                db.createObjectStore(store.name, store.options || { keyPath: 'key' });
              }
            });
          };

          request.onsuccess = () => {
            const db = request.result;
            resolve(db);
          };

          request.onerror = () => {
            reject(request.error);
          };
        });
      }
    private async open(): Promise<IDBDatabase> {
        if (this.db) {
            return this.db;
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                this.ensureStoreExists(db);
            };

            request.onsuccess = () => {
                this.db = request.result;

                // Vérification finale que le store existe
                if (!this.db.objectStoreNames.contains(this.storeName)) {
                    reject(new Error(`Store "${this.storeName}"could not be created`));
                    return;
                }
                resolve(this.db);
            };

            request.onerror = () => {
                console.error('Error opening DB:', request.error);
                reject(request.error);
            };
        });
    }

    private ensureStoreExists(db: IDBDatabase): void {
        console.log('db.objectStoreNames',db.objectStoreNames);
        if (!db.objectStoreNames.contains(this.storeName)) {
            console.log(`Creating store "${this.storeName}" with keyPath "${this.keyPath}"`);
            db.createObjectStore(this.storeName, { keyPath: this.keyPath });
        } else {
            console.log(`Store "${this.storeName}" already exists`);
        }
    }

    async verifyStore(): Promise<boolean> {
        try {
            const db = await this.open();
            return db.objectStoreNames.contains(this.storeName);
        } catch (error) {
            console.error('Error verifying store:', error);
            return false;
        }
    }

    async close(): Promise<void> {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }

    async get(key: IDBValidKey): Promise<T | undefined> {
        const db = await this.open();

        return new Promise((resolve, reject) => {
            try {
                const transaction = db.transaction(this.storeName, 'readonly');
                const store = transaction.objectStore(this.storeName);

                const request = store.get(key);

                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            } catch (error) {
                reject(error);
            }
        });
    }

    async getAll(key?: IDBValidKey): Promise<T[]> {
        const db = await this.open();

        return new Promise((resolve, reject) => {
            try {
                const transaction = db.transaction(this.storeName, 'readonly');
                const store = transaction.objectStore(this.storeName);

                const request = key ? store.getAll(key) : store.getAll();

                request.onsuccess = () => resolve(request.result as T[]);
                request.onerror = () => reject(request.error);
            } catch (error) {
                reject(error);
            }
        });
    }

    async set(data: T): Promise<IDBValidKey> {
        const db = await this.open();

        return new Promise((resolve, reject) => {
            try {
                const transaction = db.transaction(this.storeName, 'readwrite');
                const store = transaction.objectStore(this.storeName);

                const request = store.put(data);

                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            } catch (error) {
                reject(error);
            }
        });
    }

    async update(key: IDBValidKey, updates: Partial<T>): Promise<void> {
        const db = await this.open();

        return new Promise((resolve, reject) => {
            try {
                const transaction = db.transaction(this.storeName, 'readwrite');
                const store = transaction.objectStore(this.storeName);

                const getRequest = store.get(key);

                getRequest.onsuccess = () => {
                    const existingData = getRequest.result;
                    if (!existingData) {
                        reject(new Error('Record not found'));
                        return;
                    }

                    const updatedData = { ...existingData, ...updates };
                    const putRequest = store.put(updatedData);

                    putRequest.onsuccess = () => resolve();
                    putRequest.onerror = () => reject(putRequest.error);
                };

                getRequest.onerror = () => reject(getRequest.error);
            } catch (error) {
                reject(error);
            }
        });
    }

    async delete(key: IDBValidKey): Promise<void> {
        const db = await this.open();

        return new Promise((resolve, reject) => {
            try {
                const transaction = db.transaction(this.storeName, 'readwrite');
                const store = transaction.objectStore(this.storeName);

                const request = store.delete(key);

                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            } catch (error) {
                reject(error);
            }
        });
    }
    async deleteMany(keys: string[]): Promise<void> {
        const db = await this.open();

        return new Promise((resolve, reject) => {
            try {
                const transaction = db.transaction(this.storeName, 'readwrite');
                const store = transaction.objectStore(this.storeName);
                transaction.oncomplete = () => resolve();
                transaction.onerror = () => reject(transaction.error);
                keys.forEach(key => {
                    const request = store.delete(key);
                    request.onerror = () => reject(request.error);
                })
            } catch (error) {
                reject(error);
            }
        });
    }

    async search(
        predicate: (value: T) => boolean,
        count?: number
    ): Promise<T[]> {
        const db = await this.open();

        return new Promise((resolve, reject) => {
            try {
                const transaction = db.transaction(this.storeName, 'readonly');
                const store = transaction.objectStore(this.storeName);
                const request = store.openCursor();
                const results: T[] = [];

                request.onsuccess = (event) => {
                    const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
                    if (cursor) {
                        if (predicate(cursor.value)) {
                            results.push(cursor.value);
                            if (count && results.length >= count) {
                                resolve(results);
                                return;
                            }
                        }
                        cursor.continue();
                    } else {
                        resolve(results);
                    }
                };

                request.onerror = () => reject(request.error);
            } catch (error) {
                reject(error);
            }
        });
    }

    async clear(): Promise<void> {
        const db = await this.open();

        return new Promise((resolve, reject) => {
            try {
                const transaction = db.transaction(this.storeName, 'readwrite');
                const store = transaction.objectStore(this.storeName);

                const request = store.clear();

                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            } catch (error) {
                reject(error);
            }
        });
    }

    static async deleteDatabase(dbName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.deleteDatabase(dbName);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
            request.onblocked = () => reject(new Error('Database deletion blocked'));
        });
    }

    static async createStores(dbName: string, stores: Array<{name: string, options?: IDBObjectStoreParameters}>): Promise<void> {
        return new Promise((resolve, reject) => {
            // Utiliser un timestamp comme version pour forcer l'upgrade
            const version = Date.now();
            const request = indexedDB.open(dbName, version);

            request.onupgradeneeded = () => {
                const db = request.result;
                stores.forEach(store => {
                    if (!db.objectStoreNames.contains(store.name)) {
                        db.createObjectStore(store.name, store.options || { keyPath: 'key' });
                    }
                });
            };

            request.onsuccess = () => {
                request.result.close();
                resolve();
            };

            request.onerror = () => reject(request.error);
        });
    }

}


export default IndexedDb;
