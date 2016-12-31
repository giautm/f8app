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

  class Root extends React.Component {
    state: {
      isLoading: boolean;
      store: any;
    };

    constructor() {
      super();
      this.state = {
        isLoading: true,
        store: configureStore(() => this.setState({ isLoading: false })),
      };
    }
    render() {
      if (this.state.isLoading) {
        return null;
      }

      return (
        <Provider store={this.state.store}>
          <AppRoot />
        </Provider>
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
