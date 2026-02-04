import adapter from '../libraries/analyticsAdapter/AnalyticsAdapter.js';
import { EVENTS } from '../src/constants.js';
import adaptermanager from '../src/adapterManager.js';
import {ajax} from '../src/ajax.js';
import { logInfo, logError } from '../src/utils.js';
const GVLID = 1378;
const ADAPTER_CODE = 'teal';
const analyticsType = 'endpoint';
const analyticsEndpointUrl = 'https://a.bids.ws/bids/imp';
let initOptions = {};
let isAdapterEnabled = false;

let tealAdapter = Object.assign(adapter({url: analyticsEndpointUrl, analyticsType}), {
  track({eventType, args}) {
    if (!isAdapterEnabled) {
      return;
    }
    if (eventType === EVENTS.BID_WON && args.source === 'client') {
      const bidResponse = args;
      const payload = {
        account: initOptions.account,
        adomain: bidResponse.meta?.advertiserDomains?.[0] || '',
        auctionid: bidResponse.auctionId || '',
        bidder: bidResponse.bidder || '',
        bidid: bidResponse.requestId || '',
        currency: bidResponse.currency || '',
        impid: bidResponse.adUnitCode || '',
        mediatype: bidResponse.mediaType || '',
        origprice: String(bidResponse.originalCpm || ''),
        origcurrency: bidResponse.originalCurrency || '',
        price: String(bidResponse.cpm || ''),
        size: bidResponse.size || '',
        url: window.location.href || '',
        features: bidResponse.teal?.nativeRendered ? '1' : '0'
      };
      const callbacks = {
        success: function(responseText, xhr) {
          logInfo(`Teal Analytics - ${eventType} event sent successfully.`);
        },
        error: function(statusText, xhr) {
          logError(`Teal Analytics - ${eventType} event send failure. Status: ${xhr.status} (${statusText});`);
        }
      };
      ajax(analyticsEndpointUrl, callbacks, JSON.stringify(payload), {method: 'POST', contentType: 'application/json'});
    }
  }
});

tealAdapter.originEnableAnalytics = tealAdapter.enableAnalytics;
tealAdapter.enableAnalytics = function(config) {
  initOptions = config.options || {};
  if (!initOptions.account) {
    logError('Teal Analytics - account is required for initialisation');
    isAdapterEnabled = false;
  } else {
    isAdapterEnabled = true;
  }
  tealAdapter.originEnableAnalytics(config);
}

adaptermanager.registerAnalyticsAdapter({
  adapter: tealAdapter,
  code: ADAPTER_CODE,
  gvlid: GVLID
});

export default tealAdapter;
