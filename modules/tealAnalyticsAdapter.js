import adapter from '../libraries/analyticsAdapter/AnalyticsAdapter.js';
import { EVENTS } from '../src/constants.js';
import adaptermanager from '../src/adapterManager.js';
import {ajax} from '../src/ajax.js';
import { logInfo, logError } from '../src/utils.js';
const GVLID = 1378;
const ADAPTER_CODE = 'teal';
const analyticsType = 'endpoint';
const analyticsEnpointUrl = 'https://analytics.auth.inc/someendpoint';
let initOptions = {};

let tealAdapter = Object.assign(adapter({url: analyticsEnpointUrl, analyticsType}), {
  track({eventType, args}) {
    const bidResponse = args;
    if (eventType === EVENTS.BID_WON && bidResponse.source === 'client') {
      const payload = {
        account: initOptions.account,
        adomain: bidResponse.meta?.advertiserDomains?.[0] || '',
        auctionid: bidResponse.auctionId,
        bidder: bidResponse.bidder,
        bidid: bidResponse.requestId,
        currency: bidResponse.currency,
        impid: bidResponse.adUnitCode,
        isclient: true,
        mediatype: bidResponse.mediaType,
        origprice: bidResponse.originalCpm,
        origcurrency: bidResponse.originalCurrency,
        price: bidResponse.cpm,
        size: bidResponse.size,
        url: window.location.href
      };
      const callbacks = {
        success: function(responseText, xhr) {
          logInfo(`Teal Analytics - ${eventType} event sent successfully.`);
        },
        error: function(statusText, xhr) {
          logError(`Teal Analytics - ${eventType} event send failure. Status: ${xhr.status} (${statusText});`);
        }
      };
      ajax(analyticsEnpointUrl, callbacks, JSON.stringify(payload), {method: 'POST', contentType: 'application/json'});
    }
  }
});

tealAdapter.originEnableAnalytics = tealAdapter.enableAnalytics;
tealAdapter.enableAnalytics = function(config) {
  initOptions = config.options || {};
  tealAdapter.originEnableAnalytics(config);
}

adaptermanager.registerAnalyticsAdapter({
  adapter: tealAdapter,
  code: ADAPTER_CODE,
  gvlid: GVLID
});

export default tealAdapter;
