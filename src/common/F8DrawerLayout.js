/**
 * @flow
 * @providesModule F8DrawerLayout
 */
'use strict';

import React from 'react';
import {
  DrawerLayoutAndroid
} from 'react-native';

class DrawerLayout extends React.Component {
  static contextTypes = {
    addBackButtonListener: React.PropTypes.func,
    removeBackButtonListener: React.PropTypes.func,
  };

  _drawer: ?DrawerLayoutAndroid;

  componentWillUnmount() {
    this._drawer = null;
    this.context.removeBackButtonListener(this.handleBackButton);
  }

  handleBackButton = (): boolean => {
    this.closeDrawer();
    return true;
  };

  closeDrawer = () => {
    this._drawer && this._drawer.closeDrawer();
  };

  openDrawer = () => {
    this._drawer && this._drawer.openDrawer();
  };

  onDrawerClose = () => {
    this.context.removeBackButtonListener(this.handleBackButton);
    this.props.onDrawerClose && this.props.onDrawerClose();
  };

  onDrawerOpen = () => {
    this.context.addBackButtonListener(this.handleBackButton);
    this.props.onDrawerOpen && this.props.onDrawerOpen();
  };

  render() {
    const { drawerPosition, ...props } = this.props;
    const { Left, Right } = DrawerLayoutAndroid.positions;
    return (
      <DrawerLayoutAndroid
        {...props}
        drawerPosition={drawerPosition === 'right' ? Right : Left}
        onDrawerClose={this.onDrawerClose}
        onDrawerOpen={this.onDrawerOpen}
        ref={(drawer) => { this._drawer = drawer; }}
      />
    );
  }
}

export default DrawerLayout;
