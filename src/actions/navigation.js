/**
 * @flow
 */

'use strict';

import type { Action } from './types';

type Tab = 'schedule' | 'my-schedule' | 'map' | 'notifications' | 'info';

export const switchTab = (tab: Tab): Action => ({
  type: 'SWITCH_TAB',
  tab,
});

export const switchDay = (day: 1 | 2): Action => ({
  type: 'SWITCH_DAY',
  day,
});
