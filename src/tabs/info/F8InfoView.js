/**
 * @providesModule F8InfoView
 * @flow
 */
'use strict';

import React from 'react';
import {
  View,
} from 'react-native';
import ListContainer from 'ListContainer';
import CommonQuestions from './CommonQuestions';
import LinksList from './LinksList';
import PureListView from '../../common/PureListView';
import Relay from 'react-relay';
import WiFiDetails from './WiFiDetails';


const POLICIES_LINKS = [{
  title: 'Terms of Service',
  url: 'https://m.facebook.com/terms?_rdr',
}, {
  title: 'Data Policy',
  url: 'https://m.facebook.com/policies?_rdr',
}, {
  title: 'Code of Conduct',
  url: 'https://www.fbf8.com/code-of-conduct',
}];

function F8InfoView() {
  return (
    <ListContainer
      title="Information"
      backgroundImage={require('./img/info-background.png')}
      backgroundColor={'#47BFBF'}>
      <InfoList />
    </ListContainer>
  );
}

function InfoList({viewer: {config, faqs, pages}, ...props}) {
  return (
    <PureListView
      renderEmptyList={() => (
        <View>
          <WiFiDetails
            network={config.wifiNetwork}
            password={config.wifiPassword}
          />
          <CommonQuestions faqs={faqs} />
          <LinksList title="Facebook pages" links={pages} />
          <LinksList title="Facebook policies" links={POLICIES_LINKS} />
        </View>
      )}
      {...(props: any /* flow can't guarantee the shape of props */)}
    />
  );
}

InfoList = Relay.createContainer(InfoList, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        config {
          wifiNetwork
          wifiPassword
        }
        faqs {
          question
          answer
        }
        pages {
          title
          url
          logo
        }
      }
    `,
  },
});

export default F8InfoView;
