import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FB_APIKEY,
  authDomain: `${process.env.REACT_APP_FB_ID}.firebaseapp.com`,
  databaseURL: `https://${process.env.REACT_APP_FB_ID}.firebaseio.com`,
  storageBucket: `https://${process.env.REACT_APP_FB_ID}.appspot.com`,
};

const firebaseDB = (key) => ({
  init: async () => {
    return new Promise((resolve, reject) => {
      try {
        firebase.initializeApp(firebaseConfig);
        window.database = firebase.database();
        // window.database.ref('/options/').push().set('okok');
        // window.database.ref('/test/').set({
        //   1234: 'aaa',
        //   2345: 'bbb',
        //   3456: 'ccc',
        //   4567: 'ddd',
        //   5678: 'eee',
        // });
        // window.database
        //   .ref('/test/')
        //   .startAt('3333')
        //   .once('value')
        //   .then(function (snapshot) {
        //     console.log(snapshot.val());
        //   });
        resolve(window.database);
      } catch (error) {
        console.log('Impossible de se connecter à Firebase');
        reject();
      }
    });
  },

  getAll: async () => {
    if (!window.database) return Promise.reject();
    return window.database
      .ref(`/${key}/`)
      .once('value')
      .then((snapshot) => snapshot.val());
  },

  getByIndex: async (index) => {
    if (!window.database) return Promise.reject();
    return window.database
      .ref(`/${key}/${index}`)
      .once('value')
      .then((snapshot) => snapshot.val());
  },

  getByDate: async (date) => {
    if (!window.database) return Promise.reject();
    return window.database
      .ref(`/${key}`)
      .orderByChild('date')
      .equalTo(date)
      .once('value')
      .then((snapshot) => snapshot.val());
  },

  save: async (label, value) => {
    if (!window.database) return Promise.reject();
    if (value) {
      return window.database.ref(`/${key}/${label}`).set(value);
    } else {
      console.log(label);
      // return window.database.ref(`/${key}`).push().set(label);
      return window.database
        .ref(`/${key}`)
        .push(label)
        .then((snapshot) => snapshot.key);
    }
  },
});

export default firebaseDB;
