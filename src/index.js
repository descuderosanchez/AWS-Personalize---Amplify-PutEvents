import Analytics, { AmazonPersonalizeProvider } from '@aws-amplify/analytics';
import Amplify from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';
import awsconfig from './aws-exports';

const functionOptions = {
  SET_IDENTIFY_AMPLIFY: 'SET_IDENTIFY_AMPLIFY',
  SET_INFO_PRODUCT: 'SET_INFO_PRODUCT',
  SET_EVENT_PRODUCT: 'SET_EVENT_PRODUCT',
  SET_EVENT_CATEGORY: 'SET_EVENT_CATEGORY',
  GET_RECOMMENDATIONS: 'GET_RECOMMENDATIONS',
};

function configureAndConnectAmplify() {
  Amplify.configure(awsconfig);
  Analytics.addPluggable(new AmazonPersonalizeProvider());
  Analytics.configure({
    AmazonPersonalize: {

      // REQUIRED - The trackingId to track the events
      trackingId: 'TRACKINGID',

      // OPTIONAL -  Amazon Personalize service region
      region: 'eu-west-1',

      // OPTIONAL - The number of events to be deleted from the buffer when flushed.
      flushSize: 10,

      // OPTIONAL - The interval in milliseconds to perform a buffer check and flush if necessary.
      flushInterval: 5000, // 5s
    },
  });
}

async function identifyAmplify(userId, shopId) {
  Analytics.record({
    eventType: 'Identify',
    properties: {
      "userId":userId,
    },
  }, 'AmazonPersonalize');

  
}

desApi.call = async function (shopId, functionOption, itemId, eventType, eventValue, category, catalog, stock, idCombination, name, offer, price, urlImage1, urlImage2, description, urlProduct) {
configureAndConnectAmplify();

  let userId;
  await Auth.currentCredentials()
    .then((d) => {
      userId = d.params.IdentityId;
    });

  identifyAmplify(userId, shopId);
  switch (functionOption) {
    case functionOptions.SET_INFO_PRODUCT:
      sendInfoProductToAmplify(eventType, itemId, category, stock, catalog, idCombination, name, offer, price, urlImage1, urlImage2, description, urlProduct, shopId);
      break;
    case functionOptions.SET_EVENT_PRODUCT:
      sendEventProductToAmplify(userId, itemId, eventType, eventValue, category, catalog, shopId);
      break;
    case functionOptions.SET_EVENT_CATEGORY:
      sendEventCategoryToAmplify(userId, itemId, eventType, eventValue);
      break;
    case functionOptions.GET_RECOMMENDATIONS:
      break;
    default:
      break;
  }
  console.log(`Send event${functionOption}to userId:${userId}`);
};

async function sendInfoProductToAmplify(eventType, itemId, category, stock, catalog, idCombination, name, offer, price, urlImage1, urlImage2, description, urlProduct, shopId) {
  Analytics.record({
    eventType,
    properties: {
      itemId,
      category,
      stock,
    },
  },
  functionOptions.SET_INFO_PRODUCT);
}

async function sendEventProductToAmplify(userId, itemIdValue, eventTypeValue, eventValueValue, category, catalog, shopId) {
  Analytics.record({
    eventType: eventTypeValue,
    /*userId: userIdValue,*/
    properties: {
      "itemId": itemIdValue.toString(),
      "eventValue":parseInt(eventValueValue)
    },
  }, "AmazonPersonalize");

}

function sendEventCategoryToAmplify(userId, itemId, eventType, eventValue) {
  Analytics.record({
    eventType,
    userId,
    properties: {
      itemId,
      eventType,
      eventValue,
    },
  },
  functionOptions.SET_EVENT_CATEGORY);
}


configureAndConnectAmplify();
