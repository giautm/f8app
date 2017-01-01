/**
 * Copyright 2016 Facebook, Inc.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to
 * use, copy, modify, and distribute this software in source code or binary
 * form for use in connection with the web services and APIs provided by
 * Facebook.
 *
 * As with any software that integrates with the Facebook platform, your use
 * of this software is subject to the Facebook Developer Principles and
 * Policies [http://developers.facebook.com/policy/]. This copyright notice
 * shall be included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE
 *
 * @flow
 * @providesModule F8SpeakerProfile
 */

'use strict';

import React from 'react';
import {
  Image,
  StyleSheet,
  View,
} from 'react-native';
import F8Colors from 'F8Colors';
import { Text } from 'F8Text';

var F8SpeakerProfile = React.createClass({
  render: function() {
    var speaker = this.props.speaker;
    return (
      <View style={styles.row}>
        <Image style={styles.picture} source={{uri: speaker.pic}} />
        <View style={styles.info}>
          <Text style={styles.name}>{speaker.name}</Text>
          <Text style={styles.title}>{speaker.title}</Text>
        </View>
      </View>
    );
  }
});

const SIZE = 76;

var styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingBottom: 14,
    alignItems: 'center',
  },
  picture: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
  },
  info: {
    paddingLeft: 20,
    flex: 1,
  },
  name: {
    fontSize: 15,
    marginBottom: 2,
    color: F8Colors.darkText,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 12,
    lineHeight: 16,
    color: F8Colors.darkText,
  },
});

export default F8SpeakerProfile;
