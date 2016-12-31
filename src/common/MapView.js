/**
 * @flow
 */
'use strict';

import React from 'react';
import {
  InteractionManager,
  Image,
  PixelRatio,
  StyleSheet,
  View
} from 'react-native';

import type { Map } from '../reducers/maps';

class MapView extends React.Component {
  _isMounted: boolean;
  props: {
    map: ?Map;
    style?: any;
  };
  state: {
    loaded: boolean;
  };

  constructor() {
    super();
    this.state = { loaded: false };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    InteractionManager.runAfterInteractions(() => {
      this._isMounted && this.setState({loaded: true});
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    let image = null;
    if (this.state.loaded) {
      image = (
        <Image
          style={styles.map}
          source={{uri: urlForMap(this.props.map)}}
        />
      );
    }
    return (
      <View style={[styles.container, this.props.style]}>
        {image}
      </View>
    );
  }
}

function urlForMap(map: ?Map): string {
  if (!map) {
    return '';
  }
  switch (PixelRatio.get()) {
    case 1: return map.x1url;
    case 2: return map.x2url;
    case 3: return map.x3url;
  }
  return map.x3url;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: 400,
  },
  map: {
    flex: 1,
    resizeMode: Image.resizeMode.contain,
  },
});

export default MapView;
