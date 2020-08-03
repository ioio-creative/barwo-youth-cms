const express = require('express');
const router = express.Router();
const config = require('config');
const { generalErrorHandle } = require('../../utils/errorHandling');
const { Contact } = require('../../models/Contact');
const { Bounces } = require('../../models/Bounces');
const { Complaints } = require('../../models/Complaints');

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
  if (
    req.headers['x-amz-sns-message-type'] === 'Notification' &&
    req.body.Message
  ) {
    // console.log(req.body.Message);
    await handleSnsNotification(req, res);
  } else if (
    req.headers['x-amz-sns-message-type'] === 'SubscriptionConfirmation'
  ) {
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
};

router.post('/handle-bounces', async function (req, res) {
  try {
    // console.log('bounces');
    await handleResponse(topicArnBounce, req, res);

    const bounceInfo = new Bounces({
      emailAddresses: req.body.Message.bounce.bouncedRecipients.map(
        bouncedRecipient => {
          return bouncedRecipient.emailAddress;
        }
      )
    });

    // console.log(bounceInfo);

    for (index in bounceInfo.emailAddresses) {
      console.log(index);
      await Contact.findOneAndUpdate(
        { emailAddress: bounceInfo.emailAddresses[index] },
        { $set: { isEnabled: false } },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Successfully received message'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/handle-complaints', async function (req, res) {
  try {
    handleResponse(topicArnComplaint, req, res);

    const complaintsInfo = new Complaints({
      emailAddresses: req.body.Message.complaints.complaintsdRecipients.map(
        complaintsdRecipient => {
          return complaintsdRecipient.emailAddress;
        }
      )
    });

    for (index in complaintsInfo.emailAddresses) {
      console.log(index);
      await Contact.findOneAndUpdate(
        { emailAddress: complaintsInfo.emailAddresses[index] },
        { $set: { isEnabled: false } },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Successfully received message.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
    generalErrorHandle(err, res);
  }
});

module.exports = router;
