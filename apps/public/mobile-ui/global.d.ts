/// <reference path="node_modules/@tarojs/plugin-platform-weapp/types/shims-weapp.d.ts" />

declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';

declare namespace NodeJS {
  interface ProcessEnv {
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd'
  }
	// compatibility with older typings
	interface Timer extends RefCounted {
		hasRef(): boolean;
		refresh(): this;
		[Symbol.toPrimitive](): number;
}
/**
 * This object is created internally and is returned from `setImmediate()`. It
 * can be passed to `clearImmediate()` in order to cancel the scheduled
 * actions.
 *
 * By default, when an immediate is scheduled, the Node.js event loop will continue
 * running as long as the immediate is active. The `Immediate` object returned by `setImmediate()` exports both `immediate.ref()` and `immediate.unref()`functions that can be used to
 * control this default behavior.
 */
class Immediate implements RefCounted {
		/**
		 * When called, requests that the Node.js event loop _not_ exit so long as the`Immediate` is active. Calling `immediate.ref()` multiple times will have no
		 * effect.
		 *
		 * By default, all `Immediate` objects are "ref'ed", making it normally unnecessary
		 * to call `immediate.ref()` unless `immediate.unref()` had been called previously.
		 * @since v9.7.0
		 * @return a reference to `immediate`
		 */
		ref(): this;
		/**
		 * When called, the active `Immediate` object will not require the Node.js event
		 * loop to remain active. If there is no other activity keeping the event loop
		 * running, the process may exit before the `Immediate` object's callback is
		 * invoked. Calling `immediate.unref()` multiple times will have no effect.
		 * @since v9.7.0
		 * @return a reference to `immediate`
		 */
		unref(): this;
		/**
		 * If true, the `Immediate` object will keep the Node.js event loop active.
		 * @since v11.0.0
		 */
		hasRef(): boolean;
		_onImmediate: Function; // to distinguish it from the Timeout class
}
/**
 * This object is created internally and is returned from `setTimeout()` and `setInterval()`. It can be passed to either `clearTimeout()` or `clearInterval()` in order to cancel the
 * scheduled actions.
 *
 * By default, when a timer is scheduled using either `setTimeout()` or `setInterval()`, the Node.js event loop will continue running as long as the
 * timer is active. Each of the `Timeout` objects returned by these functions
 * export both `timeout.ref()` and `timeout.unref()` functions that can be used to
 * control this default behavior.
 */
class Timeout implements Timer {
		/**
		 * When called, requests that the Node.js event loop _not_ exit so long as the`Timeout` is active. Calling `timeout.ref()` multiple times will have no effect.
		 *
		 * By default, all `Timeout` objects are "ref'ed", making it normally unnecessary
		 * to call `timeout.ref()` unless `timeout.unref()` had been called previously.
		 * @since v0.9.1
		 * @return a reference to `timeout`
		 */
		ref(): this;
		/**
		 * When called, the active `Timeout` object will not require the Node.js event loop
		 * to remain active. If there is no other activity keeping the event loop running,
		 * the process may exit before the `Timeout` object's callback is invoked. Calling`timeout.unref()` multiple times will have no effect.
		 * @since v0.9.1
		 * @return a reference to `timeout`
		 */
		unref(): this;
		/**
		 * If true, the `Timeout` object will keep the Node.js event loop active.
		 * @since v11.0.0
		 */
		hasRef(): boolean;
		/**
		 * Sets the timer's start time to the current time, and reschedules the timer to
		 * call its callback at the previously specified duration adjusted to the current
		 * time. This is useful for refreshing a timer without allocating a new
		 * JavaScript object.
		 *
		 * Using this on a timer that has already called its callback will reactivate the
		 * timer.
		 * @since v10.2.0
		 * @return a reference to `timeout`
		 */
		refresh(): this;
		[Symbol.toPrimitive](): number;
}
}
