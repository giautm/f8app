/**
 * @flow
 */
'use strict';
import React from 'react';
import {
  Image,
  Linking,
  StyleSheet,
  View,
} from 'react-native';
import F8Colors from 'F8Colors';
import ItemsWithSeparator from '../../common/ItemsWithSeparator';
import Section from './Section';
import F8Touchable from 'F8Touchable';
import { Text } from 'F8Text';

class LinksList extends React.Component {
  props: {
    title: string;
    links: Array<{
      logo?: ?string;
      title: string;
      url?: string;
      onPress?: () => void;
    }>;
  };

  render() {
    let content = this.props.links.map(
      (link) => <Row link={link} key={link.title} />
    );
    return (
      <Section title={this.props.title}>
        <ItemsWithSeparator separatorStyle={styles.separator}>
          {content}
        </ItemsWithSeparator>
      </Section>
    );
  }
}

class Row extends React.Component {
  props: {
    link: {
      logo: ?string;
      title: string;
      url?: string;
      onPress?: () => void;
    };
  };

  render() {
    var {logo, title} = this.props.link;
    var image = logo && <Image style={styles.picture} source={{uri: logo}} />;
    return (
      <F8Touchable onPress={this.handlePress.bind(this)}>
        <View style={styles.row}>
          {image}
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Image source={require('../../common/img/disclosure.png')} />
        </View>
      </F8Touchable>
    );
  }

  handlePress() {
    var {url, onPress} = this.props.link;
    if (onPress) {
      onPress();
    }
    if (url) {
      Linking.openURL(url);
    }
  }
}

const IMAGE_SIZE = 44;

var styles = StyleSheet.create({
  separator: {
    marginHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    height: 60,
  },
  picture: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    marginRight: 16,
  },
  title: {
    fontSize: 17,
    color: F8Colors.darkText,
    flex: 1,
  },
  button: {
    padding: 10,
  },
  like: {
    letterSpacing: 1,
    color: F8Colors.actionText,
    fontSize: 12,
  },
});

export default LinksList;
