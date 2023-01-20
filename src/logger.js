const fs = require('fs');

const log = (req, res = null) => {
  // if logs folder does not exist, create it
  if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
  }

  const date = new Date();
  const logFile = getLogFileName();

  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, '');
  }

  fs.appendFileSync(logFile, `\n${date.toISOString()}\t\t`);
  // append request to log file
  fs.appendFileSync(logFile, `${req.method}\t\t${req.url}\t\t`);
  // if has body, append body to log file
  if (req.body && Object.keys(req.body).length > 0) {
    fs.appendFileSync(logFile, JSON.stringify(req.body));
  }

  if (res) {
    fs.appendFileSync(logFile, `\t\t${JSON.stringify(res)}`);
  }
};

const getLog = () => {
  const logFile = getLogFileName();
  if (!fs.existsSync(logFile)) {
    return 'No logs found';
  }

  const content = fs.readFileSync(logFile, 'utf8');

  const contentAsList = content
    .split('\n')
    .filter((line) => line.length > 0)
    .map((line) => {
      const [date, method, url, body, response] = line.split('\t\t');
      return {
        date,
        method,
        url,
        body: body ? JSON.parse(body) : null,
        response: response ? JSON.parse(response) : null,
      };
    });

  // sort by date descending
  contentAsList.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  return contentAsList;
};

const getLogFileName = () => {
  const date = new Date();
  // if file logs/DD-MM-YYYY.log does not exist, create it
  const mm =
    date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
  const dd = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
  const logFile = `logs/${date.getFullYear()}-${mm}-${dd}.log`;

  return logFile;
};

module.exports = {
  log,
  getLog,
};
