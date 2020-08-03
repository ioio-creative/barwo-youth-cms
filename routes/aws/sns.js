const express = require('express');
const router = express.Router();
const { generalErrorHandle } = require('../../../utils/errorHandling');
const config = require('config');
const { getArraySafe } = require('../../../utils/js/array/isNonEmptyArray');
const { Contact } = require('../../models/Contact');
const { Bounces } = require('../../models/Bounces');
const { Complaints } = require('../../models/Complaints');

const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: config.get('Aws.accessKeyId'),
  secretAccessKey: config.get('Aws.secretAccessKey'),
  region: config.get('Aws.s3.region')
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
  Protocol: 'https',
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
  const message = JSON.parse(req.body.Message);
  if (
    (message && message.notificationType == 'Bounce') ||
    message.notificationType == 'Complaint'
  ) {
    const mail = message.mail;
    if (mail && mail.destination) {
      for (let i = 0; i < mail.destination.length; i++) {
        const address = mail.destination[i];

        try {
          const user = await User.findOne({ email: address }).exec();

          if (!user) continue;
          user.emailError = true;
          user.emailErrorDescription = message.notificationType;

          await user.save();
        } catch (error) {
          console.error(error.message);
          generalErrorHandle(err, res);
        }
      }
    }
  }
};

const handleResponse = async (topicArn, req, res) => {
  if (
    req.headers['x-amz-sns-message-type'] === 'Notification' &&
    req.body.Message
  ) {
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
    await handleResponse(topicArnBounce, req, res);
    console.log('bounces');

    // let bounceInfo = [];
    // bounceInfo = new Bounces({
    //   emailAddresses: bounce.bouncedRecipients.map(bouncedRecipient => {
    //     return bouncedRecipient.emailAddress;
    //   })
    // });

    // let contacts = await Contact.find({});

    // for (index in bounceInfo) {
    //   getArraySafe(contacts).findOneAndUpdate(
    //     { emailAddress: bounceInfo[index].emailAddress },
    //     { $set: (isEnabled = false) },
    //     { new: true }
    //   );
    // }

    res.status(200).json({
      success: true,
      message: 'Successfully received message'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
    generalErrorHandle(err, res);
  }
});

router.post('/handle-complaints', async function (req, res) {
  try {
    handleResponse(topicArnComplaint, req, res);

    // let complaintInfo = [];
    // complaintInfo = new Complaints({
    //   emailAddresses: complaint.complaintdRecipients.map(
    //     complaintdRecipient => {
    //       return complaintdRecipient.emailAddress;
    //     }
    //   )
    // });

    // let contacts = await Contact.find({});

    // for (index in complaintInfo) {
    //   getArraySafe(contacts).findOneAndUpdate(
    //     { emailAddress: complaintInfo[index].emailAddress },
    //     { $set: (isEnabled = false) },
    //     { new: true }
    //   );
    // }

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
