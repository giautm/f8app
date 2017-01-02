/**
 * @flow
 */

'use strict';
import {
  ActionSheetIOS,
  Alert,
  InteractionManager,
  Platform,
} from 'react-native';
import Parse from 'parse/react-native';
import Share from 'react-native-share';
import { AppEventsLogger } from 'react-native-fbsdk';
import { currentInstallation, updateInstallation } from './installation';

const Agenda = Parse.Object.extend('Agenda');

import type { ThunkAction, PromiseAction, Dispatch } from './types';
import type { Session } from '../reducers/sessions';

export function addToSchedule(id: string): ThunkAction {
  return (dispatch: Dispatch) => {
    if (Parse.User.current()) {
      Parse.User.current().relation('mySchedule').add(new Agenda({id}));
      Parse.User.current().save();
      currentInstallation().then((installation) => {
        installation.addUnique('channels', `session_${id}`);
        return installation.save();
      });
    }
    dispatch({
      type: 'SESSION_ADDED',
      id,
    });
  };
}

export function removeFromSchedule(id: string): ThunkAction {
  return (dispatch: Dispatch) => {
    if (Parse.User.current()) {
      Parse.User.current().relation('mySchedule').remove(new Agenda({id}));
      Parse.User.current().save();
      currentInstallation().then((installation) => {
        installation.remove('channels', `session_${id}`);
        return installation.save();
      });
    }
    dispatch({
      type: 'SESSION_REMOVED',
      id,
    });
  };
}

export function removeFromScheduleWithPrompt(session: Session): ThunkAction {
  return (dispatch) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions({
        options: ['Remove From Schedule', 'Cancel'],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
      }, (buttonIndex) => {
        if (buttonIndex === 0) {
          dispatch(removeFromSchedule(session.id));
        }
      });
    } else {
      Alert.alert(
        'Remove From Your Schedule',
        `Would you like to remove "${session.title}" from your schedule?`,
        [
          {text: 'Cancel'},
          {
            text: 'Remove',
            onPress: () => dispatch(removeFromSchedule(session.id))
          },
        ]
      );
    }
  };
}

export async function restoreSchedule(): PromiseAction {
  const list = await Parse.User.current().relation('mySchedule').query().find();
  const channels = list.map(({id}) => `session_${id}`);
  updateInstallation({channels});

  return {
    type: 'RESTORED_SCHEDULE',
    list,
  };
}

export async function loadFriendsSchedules(): PromiseAction {
  const list = await Parse.Cloud.run('friends');
  await InteractionManager.runAfterInteractions();
  return {
    type: 'LOADED_FRIENDS_SCHEDULES',
    list,
  };
}

export function setSharingEnabled(enabled: boolean): ThunkAction {
  return (dispatch) => {
    dispatch({
      type: 'SET_SHARING',
      enabled,
    });
    Parse.User.current().set('sharedSchedule', enabled);
    Parse.User.current().save();
  };
}

export function shareSession(session: Session): ThunkAction {
  return (dispatch, getState) => {
    const {sessionURLTemplate} = getState().config;
    const url = sessionURLTemplate
      .replace('{slug}', session.slug)
      .replace('{id}', session.id);

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showShareActionSheetWithOptions({
        message: session.title,
        url,
      }, (e) => console.error(e), logShare.bind(null, session.id));
    } else {
      Share.open({
        share_text: session.title,
        share_URL: url,
        title: 'Share Link to ' + session.title,
      }, (e) => logShare(session.id, true, null));
    }
  };
}

function logShare(id, completed, activity) {
  AppEventsLogger.logEvent('Share Session', 1, {id});
  Parse.Analytics.track('share', {
    id,
    completed: completed ? 'yes' : 'no',
    activity: activity || '?'
  });
}
