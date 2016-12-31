/**
 * @flow
 */
'use strict';

import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import F8Button from 'F8Button';
import { logInWithFacebook } from '../actions';

@connect()
class LoginButton extends React.Component {
  props: {
    style: any;
    source?: string; // For Analytics
    dispatch: (action: any) => Promise;
    onLoggedIn: ?() => void;
  };
  state: {
    isLoading: boolean;
  };
  _isMounted: boolean;

  constructor() {
    super();
    this.state = { isLoading: false };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  async logIn() {
    const { dispatch, onLoggedIn } = this.props;

    this.setState({ isLoading: true });
    try {
      await Promise.race([
        dispatch(logInWithFacebook(this.props.source)),
        timeout(15000),
      ]);
    } catch (e) {
      const message = e.message || e;
      if (message !== 'Timed out' && message !== 'Canceled by user') {
        alert(message);
        console.warn(e);
      }
      return;
    } finally {
      this._isMounted && this.setState({ isLoading: false });
    }

    onLoggedIn && onLoggedIn();
  }

  render() {
    if (this.state.isLoading) {
      return (
        <F8Button
          caption="Please wait..."
          onPress={() => {}}
          style={[styles.button, this.props.style]}
        />
      );
    }

    return (
      <F8Button
        caption="Log in with Facebook"
        onPress={() => this.logIn()}
        icon={require('../login/img/f-logo.png')}
        style={[styles.button, this.props.style]}
      />
    );
  }
}

async function timeout(ms: number): Promise {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Timed out')), ms);
  });
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    width: 270,
  },
});

export default LoginButton;
