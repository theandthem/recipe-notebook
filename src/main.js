// https://recipie-notes.herokuapp.com/v1/graphql
import Vue from "vue";
import App from "./App.vue";
import VueApollo from "vue-apollo";
// Simple working version with boost
// import ApolloClient from 'apollo-boost'
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

Vue.use(VueApollo);

// HTTP connection to the API
const httpLink = createHttpLink({
  uri: "https://recipie-notes.herokuapp.com/v1/graphql",
  headers: {
    "x-hasura-admin-secret": "jim-test-1"
  }
});

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  link: httpLink,
  cache
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  apolloProvider,
  render: h => h(App)
});
