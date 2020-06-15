const alertTypes = {
  DANGER: { color: 'red' },
  WARNING: { color: 'yellow' },
  INFO: { color: 'teal' }
};

function Alert(msg, type = alertTypes.INFO) {
  this.msg = msg;
  this.type = type;
}

/* statics */

Alert.alertTypes = alertTypes;

/* end of statics */

export default Alert;
