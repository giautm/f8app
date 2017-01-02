/**
 * @flow
 */

'use strict';

import React from 'react';
import Relay from 'react-relay';
import Parse from 'parse/react-native';
import AppRoot from 'AppRoot';
import FacebookSDK from 'FacebookSDK';

import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import { serverURL } from './env';

import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

function setup(): ReactClass<{}> {
  console.disableYellowBox = true;
  Parse.initialize('oss-f8-app-2016');
  Parse.serverURL = `${serverURL}/parse`;

  FacebookSDK.init();
  Parse.FacebookUtils.init();
  Relay.injectNetworkLayer(
    new Relay.DefaultNetworkLayer(`${serverURL}/graphql`, {
      fetchTimeout: 30000,
      retryDelays: [5000, 10000],
    })
  );

  const networkInterface = createNetworkInterface({
    uri: `${serverURL}/graphql`,
  });

  networkInterface.use([{
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};  // Create the header object if needed.
      }

      // get the authentication token from local storage if it exists
      const token = localStorage.getItem('token');
      req.options.headers.authorization = token ? `Bearer ${token}` : null;
      next();
    }
  }]);

  // Create the client as outlined above
  const client = new ApolloClient({
    networkInterface,
  });

  class Root extends React.Component {
    state: {
      isLoading: boolean;
      store: any;
    };

    constructor() {
      super();
      this.state = {
        isLoading: true,
        store: configureStore(client, () => this.setState({ isLoading: false })),
      };
    }

    render() {
      if (this.state.isLoading) {
        return null;
      }

      return (
        <ApolloProvider client={client} store={this.state.store}>
          <AppRoot />
        </ApolloProvider>
      );
    }
  }

  return Root;
}

global.LOG = (...args) => {
  console.log('/------------------------------\\');
  console.log(...args);
  console.log('\\------------------------------/');
  return args[args.length - 1];
};

export default setup;
