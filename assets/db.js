const DB_NAME = 'patchwork';
const DB_VERSION = 1;

const SCHEMA = {
    alters: {
        keyPath: 'id',
        autoIncrement: true,
        indexes: ['name'],
    },
};

let databasePromise = null;

const applySchema = (database) => {
    for (const [storeName, config] of Object.entries(SCHEMA)) {
        if (database.objectStoreNames.contains(storeName)) continue;

        const store = database.createObjectStore(storeName, {
            keyPath: config.keyPath,
            autoIncrement: config.autoIncrement,
        });

        for (const field of config.indexes ?? []) {
            store.createIndex(field, field, { unique: false });
        }
    }
};

export const openDB = () => {
    if (databasePromise) return databasePromise;

    databasePromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => applySchema(request.result);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        request.onblocked = () => reject(new Error('Database upgrade blocked by another open tab.'));
    });

    databasePromise.catch(() => {
        databasePromise = null;
    });

    return databasePromise;
};

const runRequest = async (storeName, mode, perform) => {
    const database = await openDB();

    return new Promise((resolve, reject) => {
        const transaction = database.transaction(storeName, mode);
        const request = perform(transaction.objectStore(storeName));

        transaction.oncomplete = () => resolve(request?.result);
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () =>
            reject(transaction.error ?? new Error(`Transaction on "${storeName}" was aborted.`));
    });
};

export const getAll = (storeName) => runRequest(storeName, 'readonly', (store) => store.getAll());

export const put = (storeName, record) => runRequest(storeName, 'readwrite', (store) => store.put(record));

export const remove = (storeName, key) => runRequest(storeName, 'readwrite', (store) => store.delete(key));
