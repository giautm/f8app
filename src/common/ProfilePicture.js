/**
 * @flow
 */
'use strict';

import React from 'react';
import {
  Image,
  PixelRatio,
} from 'react-native';

class ProfilePicture extends React.Component {
  props: {
    userID: string;
    size: number;
  };

  render() {
    const { userID, size } = this.props;
    const scaledSize = size * PixelRatio.get();
    const uri = `http://graph.facebook.com/${userID}/picture?width=${scaledSize}&height=${scaledSize}`;
    return (
      <Image
        source={{ uri }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
      />
    );
  }
}

export default ProfilePicture;
