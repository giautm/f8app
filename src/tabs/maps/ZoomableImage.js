/**
 * @flow
 */
'use strict';

import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

class ZoomableImage extends React.Component {
  props: {
    url: string;
  };
  state: {
    lastTapTimestamp: number;
    isZoomed: boolean;
  };

  constructor() {
    super();
    this.state = {
      lastTapTimestamp: 0,
      isZoomed: false,
    };

    (this: any).onZoomChanged = this.onZoomChanged.bind(this);
    (this: any).toggleZoom = this.toggleZoom.bind(this);
  }

  render() {
    return (
      <ScrollView
        ref={(ref) => this.zoomableScroll = ref}
        onScroll={this.onZoomChanged}
        scrollEventThrottle={100}
        scrollsToTop={false}
        alwaysBounceVertical={false}
        alwaysBounceHorizontal={false}
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        maximumZoomScale={4}
        centerContent={true}
        contentContainerStyle={{flex: 1}}>
        <TouchableWithoutFeedback onPress={this.toggleZoom}>
          <Image
            style={styles.image}
            source={{uri: this.props.url}}
          />
        </TouchableWithoutFeedback>
      </ScrollView>
    );
  }

  toggleZoom(e: any) {
    const { state: { lastTapTimestamp, isZoomed }, zoomableScroll } = this;
    const timestamp = new Date().getTime();
    if (timestamp - lastTapTimestamp <= 500) {
      const { locationX, locationY } = e.nativeEvent;
      const size = isZoomed ? { width: 10000, height: 10000 } : { width: 0, height: 0 };

      zoomableScroll.scrollResponderZoomTo({
        x: locationX,
        y: locationY,
        ...size,
      });
    }
    this.setState({ lastTapTimestamp: timestamp });
  }

  onZoomChanged(e: any) {
    this.setState({isZoomed: e.nativeEvent.zoomScale > 1});
  }
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: Image.resizeMode.contain,
  },
});

export default ZoomableImage;
