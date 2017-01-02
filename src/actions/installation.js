/**
 * @flow
 */

'use strict';
import {
  Platform,
} from 'react-native';
import Parse from 'parse/react-native';

export async function currentInstallation(): Promise<Parse.Installation> {
  const installationId = await Parse._getInstallationId();
  return new Parse.Installation({
    installationId,
    appName: 'F8',
    deviceType: Platform.OS,
    // TODO: Get this information from the app itself
    appIdentifier: Platform.OS === 'ios' ? 'com.facebook.f8' : 'com.facebook.f8',
  });
}

export async function updateInstallation(updates: Object = {}): Promise<void> {
  const installation = await currentInstallation();
  await installation.save(updates);
}
