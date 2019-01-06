var Op = require("sequelize").Op;
var SQ = require('./models').sequelize;
var User = require('./models').User;
var FCMToken = require('./models').FCMToken;
var Session = require('./models').Session;

const { exec } = require('child_process');

module.exports.migrate = async (down) => {
  await new Promise((resolve, reject) => {
    let command = 'sequelize db:migrate';
    if (down) command = 'sequelize db:migrate:undo:all';

    const migrate = exec(
      command,
      { env: process.env },
      (err, stdout, stderr) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );

    // Forward stdout+stderr to this process
    // migrate.stdout.pipe(process.stdout);
    migrate.stderr.pipe(process.stderr);
  })
}

module.exports.sync = () => {
  SQ.sync({ force: true });
}

function randomString(len) {
  let chars = 'abcdefghijklmnopqrstuvwxyz';

  let str = [];
  for (var i = 0; i < len; i++) str.push(chars.charAt(Math.floor(Math.random() * (chars.length-1))));

  return str.join('');
}
module.exports.randomString = randomString;

function randomEmail() {
  return `${randomString(20)}@gmail.com`
}
module.exports.randomEmail = randomEmail;

module.exports.createUser = () => {
  return SQ.transaction(t => {
    return User.create({
      name: `${randomString(10)} ${randomString(10)}`,
      email: randomEmail(),
      passwordHash: 'SaVNC9ubXV8BHykB2wAD0mhxPwh/W7O7Rz+qRy/PeV+GeeakLzkv2TSghPQvLTe07b7TqxdsRUt39lC3RaaWmhORkVS9UbtEIh9dzvcbj9VzHA0ex0k97nv0lE56Jh6D6M5Laxe2BrkpiUibP3yCDCk75vCHtLGTZVjqtabTGheIs/QwiD72C7H+bK4QSL2RYSOEbB0wysNAC5nF8r1m36FB/DS5wEixOWiQH470H1s9yHODAALNag9Lom+It4P3cMSSa83mxPNvFOniEpuDDcI5W/Oxef/XiA3EhMLL8n4+CSV1Z891g65U7j7RIKSCjK1LbCvQ5JuS/jZCErNBW9472TXdGKGeYY6RTDgSBzqISyxlMCSRBsNjToWHJyPEyEbt0BTSjTkliB+0wSQpdzUiDDiJNrLVimAriH/AcU/eFvpU5YyyY1coY8Kc80LxKxP/p881Q0DABCmaRcDH+/1iEz3SoWNvSsw/Xq8u9LcgKCjccDoD8tKBDkMijS7TBPu9zJd2nUqblPO+KTGz7hVqh/u0VQ+xEdvRQuKSc+4OnUtQRVCAFQGB99hfXfQvffeGosNy3BABEuZkobaUgs8m8RTaRFGqy8qk6BYw1bk5I5KjjmA8GNOtNHlKQ+1EZO83pIKbG61Jfm93FJ6CsWji9fXsxaBsv+JNBhRgmUw=',
      passwordSalt: 'dM4YXu5N5XY4c0LXnf30vtshh7dgsBYZ/5pZockgcJofPkWhMOplVAoWKhyqODZhO3mSUBqMqo3kXC2+7fOMt1NFB0Q1iRcJ4zaqAqdTenyjXu7rJ8WpgR1qnTcnpP8g/frQ+sk8Kcv49OC84R3v+FD8RrGm0rz8dDt7m7c/+Rw=',
      passwordVersion: 2
    }, {
      transaction: t
    });
  });
}

module.exports.createSession = userId => {
  var today = new Date();
  var tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  return SQ.transaction(t => {
    return Session.create({
      userId,
      token: randomString(40),
      type: 'user',
      expires: tomorrow
    }, {
      transaction: t
    });
  });
}
