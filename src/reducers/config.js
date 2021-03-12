import Immutable from 'immutable'
import { actionReducer } from './utils'
import {
  APP_CONFIGURED,
  DEFAULT_ARCH,
  DEFAULT_ENGINE_OPTION_VALUE,
  LOGIN_FAILED,
  LOGIN_SUCCESSFUL,
  LOGOUT,
  REFRESH_DATA,
  SET_ADMINISTRATOR,
  SET_CPU_TOPOLOGY_OPTIONS,
  SET_CURRENT_PAGE,
  SET_DEFAULT_TIMEZONE,
  SET_GLOBAL_DEFAULT_CONSOLE,
  SET_GLOBAL_DEFAULT_VNC_MODE,
  SET_OVIRT_API_VERSION,
  SET_USB_AUTOSHARE,
  SET_USB_FILTER,
  SET_USER_FILTER_PERMISSION,
  SET_USER_GROUPS,
  SET_USER_SESSION_TIMEOUT_INTERVAL,
  SET_USER,
  SET_WEBSOCKET,
  SHOW_TOKEN_EXPIRED_MSG,
} from '_/constants'

const initialState = Immutable.fromJS({
  appConfigured: false,
  loginToken: undefined,
  logoutWasManual: false,
  isTokenExpired: false,
  user: {
    name: undefined,
    id: undefined,
  },
  oVirtApiVersion: {
    major: undefined,
    minor: undefined,
    passed: undefined,
  },
  defaultConsole: 'vnc',
  defaultVncMode: 'Native',
  filter: true,
  isFilterChecked: false,
  administrator: false,
  userSessionTimeoutInterval: null,
  usbAutoshare: null,
  usbFilter: null,
  userGroups: [],
  currentPage: {},
  cpuOptions: {
    maxNumOfSockets: new Map([[ DEFAULT_ENGINE_OPTION_VALUE, 16 ]]),
    maxNumOfCores: new Map([[ DEFAULT_ENGINE_OPTION_VALUE, 254 ]]),
    maxNumOfThreads: new Map([[ DEFAULT_ENGINE_OPTION_VALUE, 8 ]]),
    maxNumOfVmCpusPerArch: new Map([[ DEFAULT_ENGINE_OPTION_VALUE, { ppc64: 1, x86_64: 1, s390x: 1, [DEFAULT_ARCH]: 512 } ]]),
  },
  defaultGeneralTimezone: 'Etc/GMT',
  defaultWindowsTimezone: 'GMT Standard Time',
  websocket: null,
  blankTemplateId: '00000000-0000-0000-0000-000000000000', // "engine/api/" -> special_objects.blank_template.id
  lastRefresh: 0,
})

const config = actionReducer(initialState, {
  [LOGIN_SUCCESSFUL] (state, { payload: { username, domain, token, userId } }) {
    return state.merge({
      loginToken: token,
      user: {
        name: username,
        id: userId,
      },
      domain,
    })
  },
  [LOGIN_FAILED] (state) {
    return state.delete('loginToken').deleteIn(['user', 'name'])
  },
  [LOGOUT] (state, { payload: { isManual } }) {
    return state
      .delete('loginToken')
      .deleteIn(['user', 'name'])
      .set('logoutWasManual', isManual)
  },
  [SET_OVIRT_API_VERSION] (state, { payload: { oVirtApiVersion } }) {
    return state.merge({ oVirtApiVersion: oVirtApiVersion })
  },
  [SET_USER_FILTER_PERMISSION] (state, { payload: { filter } }) {
    return state.set('filter', filter).set('isFilterChecked', true)
  },
  [SET_USER_SESSION_TIMEOUT_INTERVAL] (state, { payload: { userSessionTimeoutInterval } }) {
    return state.set('userSessionTimeoutInterval', userSessionTimeoutInterval * 60)
  },
  [SET_ADMINISTRATOR] (state, { payload: { administrator } }) {
    return state.set('administrator', administrator)
  },
  [SHOW_TOKEN_EXPIRED_MSG] (state) {
    return state.set('isTokenExpired', true)
  },
  [SET_USB_AUTOSHARE] (state, { payload: { usbAutoshare } }) {
    return state.set('usbAutoshare', usbAutoshare)
  },
  [SET_USB_FILTER] (state, { payload: { usbFilter } }) {
    return state.set('usbFilter', usbFilter)
  },
  [SET_WEBSOCKET] (state, { payload: { websocket } }) {
    return state.set('websocket', Immutable.fromJS(websocket))
  },
  [SET_USER] (state, { payload: { user } }) {
    return state.mergeDeep({ user })
  },
  [SET_GLOBAL_DEFAULT_CONSOLE] (state, { payload: { defaultConsole } }) {
    return state.set('defaultConsole', defaultConsole)
  },
  [SET_GLOBAL_DEFAULT_VNC_MODE] (state, { payload: { defaultVncMode } }) {
    return state.set('defaultVncMode', defaultVncMode)
  },
  [SET_USER_GROUPS] (state, { payload: { groups } }) {
    return state.set('userGroups', groups)
  },
  [SET_CURRENT_PAGE] (state, { payload }) {
    return state.set('currentPage', Object.assign({}, payload))
  },
  [SET_CPU_TOPOLOGY_OPTIONS] (state, { payload: {
    maxNumOfSockets,
    maxNumOfCores,
    maxNumOfThreads,
    maxNumOfVmCpusPerArch,
  } }) {
    return state.set('cpuOptions', Immutable.fromJS({
      maxNumOfSockets,
      maxNumOfCores,
      maxNumOfThreads,
      maxNumOfVmCpusPerArch,
    }))
  },
  [SET_DEFAULT_TIMEZONE] (state, { payload: {
    defaultGeneralTimezone,
    defaultWindowsTimezone,
  } }) {
    return state.merge({
      defaultGeneralTimezone,
      defaultWindowsTimezone,
    })
  },
  [REFRESH_DATA] (state) {
    return state.set('lastRefresh', Date.now())
  },
  [APP_CONFIGURED] (state) {
    return state.set('appConfigured', true)
  },
}, true)

export default config
export {
  initialState,
}
