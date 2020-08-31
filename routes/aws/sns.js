const express = require('express');
const router = express.Router();
const config = require('config');
const { generalErrorHandle } = require('../../utils/errorHandling');
const { Contact } = require('../../models/Contact');

/**
 * https://medium.com/@serbanmihai/how-to-handle-aws-ses-bounces-and-complaints-53d6e7455443
 * https://gist.github.com/mihaiserban/8a03fd28e54cac8856dbdfebd95bd7b3
 */

const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: config.get('Aws.accessKeyId'),
  secretAccessKey: config.get('Aws.secretAccessKey'),
  region: 'ap-southeast-1'
});

const sns = new AWS.SNS();

const topicArnBounce =
  'arn:aws:sns:ap-southeast-1:697502200750:ses-bounces-topic-prod';

var paramsTopicBounces = {
  Protocol: 'http',
  TopicArn: topicArnBounce,
  Endpoint: 'http://testbarwocms.ioiocreative.com/api/aws/sns/handle-bounces'
};

const topicArnComplaint =
  'arn:aws:sns:ap-southeast-1:697502200750:ses-complaints-topic-prod';

var paramsTopicComplaints = {
  Protocol: 'http',
  TopicArn: topicArnComplaint,
  Endpoint: 'http://testbarwocms.ioiocreative.com/api/aws/sns/handle-complaints'
};

sns.subscribe(paramsTopicBounces, function (error, data) {
  if (error) throw new Error(`Unable to set up SNS subscription: ${error}`);
  console.log(`SNS subscription set up successfully: ${JSON.stringify(data)}`);
});

sns.subscribe(paramsTopicComplaints, function (error, data) {
  if (error) throw new Error(`Unable to set up SNS subscription: ${error}`);
  console.log(`SNS subscription set up successfully: ${JSON.stringify(data)}`);
});

const handleSnsNotification = async (req, res) => {
  return;
};

const handleResponse = async (topicArn, req, res) => {
  if (Object.keys(req.body).length) {
    if (
      req.headers['x-amz-sns-message-type'] === 'Notification' &&
      req.body.Message
    ) {
      // console.log(req.body.Message);
      await handleSnsNotification(req, res);
    } else if (
      req.headers['x-amz-sns-message-type'] === 'SubscriptionConfirmation'
    ) {
      console.log(req.body);
      var params = {
        Token: req.body.Token,
        TopicArn: topicArn
      };
      sns.confirmSubscription(params, function (err, data) {
        if (err) throw err; // an error occurred
        console.error(data);
        generalErrorHandle(err, res);
      });
    }
  }
};

router.post('/handle-bounces', async function (req, res) {
  try {
    if (Object.keys(req.body).length) {
      await handleResponse(topicArnBounce, req, res);

      console.log('handle-bounces');

      if (req.body.Message) {
        const emailAddresses = req.body.bounce.bouncedRecipients.map(
          bouncedRecipient => {
            return bouncedRecipient.emailAddress;
          }
        );

        for (const emailAddress of emailAddresses) {
          await Contact.findOneAndUpdate(
            { emailAddress: emailAddress },
            { $set: { isEnabled: false } },
            { new: true }
          );
        }
        res.status(200).json({
          success: true,
          message: 'Successfully received message'
        });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message
    });
    //generalErrorHandle(err, res);
  }
});

router.post('/handle-complaints', async function (req, res) {
  try {
    if (Object.keys(req.body).length) {
      await handleResponse(topicArnComplaint, req, res);

      console.log('handle-complaints');

      if (req.body.Message) {
        const emailAddresses = req.body.complaints.complaintsdRecipients.map(
          complaintsdRecipient => {
            return complaintsdRecipient.emailAddress;
          }
        );

        for (const emailAddress of emailAddresses) {
          await Contact.findOneAndUpdate(
            { emailAddress: emailAddress },
            { $set: { isEnabled: false } },
            { new: true }
          );
        }

        res.status(200).json({
          success: true,
          message: 'Successfully received message.'
        });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message
    });
    //generalErrorHandle(err, res);
  }
});

module.exports = router;
