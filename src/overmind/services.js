import firebaseDB from './firebaseDB';
import indexedDB from './indexedDB';

const services = (key) => ({
  initDB: async () => {
    try {
      return await firebaseDB().init();
    } catch (error) {
      indexedDB()
        .init()
        .then((db) => {
          const tasksStore = db.createObjectStore('tasks', {
            keyPath: 'id',
            autoIncrement: true,
          });
          tasksStore.createIndex('id', 'id', { unique: true });
          tasksStore.createIndex('date', 'date', { unique: false });
          tasksStore.createIndex('clientId', 'clientId', { unique: false });

          const clientsStore = db.createObjectStore('clients', {
            keyPath: 'id',
            autoIncrement: true,
          });
          clientsStore.createIndex('id', 'id', { unique: true });

          const optionsObj = db.createObjectStore('options', {
            keyPath: 'label',
          });
          optionsObj.createIndex('label', 'label', { unique: true });
        });
    }
  },
  getAll: async () => {
    try {
      return await firebaseDB(key).getAll();
    } catch {
      return indexedDB(key).getAll();
    }
  },
  save: async (label, value) => {
    // try {
    return await firebaseDB(key).save(label, value);
    // } catch {
    //   return indexedDB(key).getAll();
    // }
  },
});

export default services;
