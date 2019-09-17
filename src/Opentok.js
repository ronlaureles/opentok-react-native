/* @flow */
/* eslint-disable react/no-multi-comp */
import React from 'react';
import { NativeModules, Platform, View } from 'react-native';
// import type { Ref } from 'react';

import NativeEventEmitter from './NativeEventEmitter';
import { OT } from './OT'

import { sanitizeSignalData } from './helpers/OTSessionHelper';
// import SubscriberView from './components/SubscriberView';
// import PublisherView from './components/PublisherView';

// import type {
//   RNOpenTokEventCallback,
//   OpenTokEvent,
//   SubscriberProps,
//   PublisherProps,
// } from './types';

const listeners = {};

// export class Subscriber extends React.Component<SubscriberProps> {
//   static defaultProps = {
//     video: true,
//   };

//   render() {
//     return <SubscriberView listeners={listeners} {...this.props} />;
//   }
// }

// export class Publisher extends React.Component<PublisherProps> {
//   static defaultProps = {
//     video: true,
//   };

//   ref: Ref<typeof PublisherView>;

//   switchCamera = () => {
//     if (this.ref && typeof this.ref !== 'string') {
//       this.ref.switchCamera();
//     }
//   };

//   render() {
//     return (
//       <PublisherView
//         ref={ref => {
//           /* $FlowFixMe */
//           this.ref = ref;
//         }}
//         listeners={listeners}
//         {...this.props}
//       />
//     );
//   }
// }

// export class ScreenCapture extends React.Component<*> {
//   render() {
//     const { children, nativeID, ...rest } = this.props;
//     return (
//       <View {...rest} nativeID="RN_OPENTOK_SCREEN_CAPTURE_VIEW">
//         {children}
//       </View>
//     );
//   }
// }

export default {
  events: Platform.select({
    ios: {
      ON_SESSION_STREAM_CREATED: 'streamCreated',
      ON_SESSION_STREAM_DESTROYED: 'streamDestroyed',
      ON_SESSION_DID_CONNECT: 'sessionDidConnect',
      ON_SESSION_DID_DISCONNECT: 'sessionDidDisconnect',
      ON_SIGNAL_RECEIVED: 'signal',
      ON_SESSION_CONNECTION_CREATED: 'connectionCreated',
      ON_SESSION_CONNECTION_DESTROYED: 'connectionDestroyed',
      ON_SESSION_DID_FAIL_WITH_ERROR: 'didFailWithError',
      ON_SESSION_DID_RECONNECT: 'sessionDidReconnect',
      ON_SESSION_DID_BEGIN_RECONNECTING: 'sessionDidBeginReconnecting',
      ON_ARCHIVE_STARTED_WITH_ID: 'archiveStartedWithId',
      ON_ARCHIVE_STOPPED_WITH_ID: 'archiveStoppedWithId',
      streamPropertyChanged: 'streamPropertyChanged',
    },
    android: {
      ON_SESSION_STREAM_CREATED: 'onStreamReceived',
      ON_SESSION_STREAM_DESTROYED: 'onStreamDropped',
      ON_SESSION_DID_CONNECT: 'onConnected',
      ON_SESSION_DID_DISCONNECT: 'onDisconnected',
      ON_SIGNAL_RECEIVED: 'onSignalReceived',
      ON_SESSION_CONNECTION_CREATED: 'onConnectionCreated',
      ON_SESSION_CONNECTION_DESTROYED: 'onConnectionDestroyed',
      ON_SESSION_DID_FAIL_WITH_ERROR: 'onError',
      ON_SESSION_DID_RECONNECT: 'onReconnected',
      ON_SESSION_DID_BEGIN_RECONNECTING: 'onReconnecting',
      ON_ARCHIVE_STARTED_WITH_ID: 'onArchiveStarted',
      ON_ARCHIVE_STOPPED_WITH_ID: 'onArchiveStopped',
      streamPropertyChanged: 'onStreamPropertyChanged',
    },
  }),

  setApiKey: (apiKey) => {
    NativeModules.RNOpenTok.setApiKey(apiKey);
  },

  connect: (apiKey, sessionId, token) => {
    OT.initSession(apiKey, sessionId);
    OT.connect(sessionId, token)
  },

  disconnect: (sessionId) => {
    OT.disconnect(sessionId);
  },

  sendSignal: (
    sessionId,
    type,
    message
  ) => {
    const signalData = sanitizeSignalData({
      type,
      data: message
    });
    OT.sendSignal(sessionId, signalData.signal, signalData.errorHandler)
  },

  on: (name, callback) => {
    if (listeners[name]) {
      listeners[name].remove();
    }
    listeners[name] = NativeEventEmitter.addListener(name, callback);
  },

  removeListener: (name) => {
    if (listeners[name]) {
      listeners[name].remove();
      delete listeners[name];
    }
  },
};