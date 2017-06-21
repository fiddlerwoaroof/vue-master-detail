import {installBrowserRouter} from 'routedux';
import {createStore, applyMiddleware, compose} from 'redux';
import Vue from 'vue';
import Revue from 'revue';

const GET_ITEM = 'GET_ITEM';
const GET_ITEMS = 'GET_ITEMS';

const {middleware, enhancer, init} = installBrowserRouter([
  ['/', 'GET_ITEMS', {}],
  ['/item/:idx', 'GET_ITEM', {}]
]);

function reducer(state, action) {
  switch (action.type) {
  case GET_ITEMS:
    return {
      ...state,
      item: null
    };
    break;
  case GET_ITEM:
    return {
      ...state,
      item: state.items[action.idx] || null
    };
    break;
  default:
    return state;
    break;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reduxStore = createStore(reducer, {
  items: [
    {title: "Impending Asteroid collision?", content: "This article is only available to subscribers, please come back later..."},
    {title: "Did the dinosaurs go extinct because of a global hot-sauce shortage?", content: "(Hint) No"}
  ],
  item: null
}, composeEnhancers(
  enhancer,
  applyMiddleware(
    middleware
  )
));

const store = new Revue(Vue, reduxStore, {
});

init();

const app = new Vue({
  el: "#root",
  data() {
    return {
      items: this.$select('items'),
      item: this.$select('item'),
    };
  },
  methods: {
    getItem(idx) {
      store.dispatch({
        type: GET_ITEM,
        idx
      });
    },
    getItems() {
      store.dispatch({
        type: GET_ITEMS
      });
    }
  }
});
