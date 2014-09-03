module.exports = function(robot) {
  var moment;
  moment = require('moment-timezone');
  require('hubot-arm')(robot);
  return robot.respond(/backlog-report\s+(\S+)(?:\s+(.+))?$/i, function(res) {
    var baseUrl, get, projectId, projectKey, spaceId, timezone, user, username, _ref;
    timezone = (_ref = process.env.HUBOT_BACKLOG_REPORT_TIMEZONE) != null ? _ref : 'Asia/Tokyo';
    spaceId = process.env.HUBOT_BACKLOG_REPORT_SPACE_ID;
    projectKey = res.match[1].toUpperCase();
    username = res.match[2];
    baseUrl = "https://" + spaceId + ".backlog.jp";
    projectId = null;
    user = null;
    get = function(path, qs) {
      if (qs == null) {
        qs = {};
      }
      qs.apiKey = process.env.HUBOT_BACKLOG_REPORT_API_KEY;
      return res.robot.arm('request')({
        method: 'GET',
        url: baseUrl + path,
        qs: qs,
        format: 'json'
      });
    };
    return get("/api/v2/projects/" + projectKey).then(function(r) {
      projectId = r.json.id;
      return get("/api/v2/projects/" + projectKey + "/users");
    }).then(function(r) {
      var qs, today;
      user = r.json.filter(function(i) {
        return i.userId === username;
      })[0];
      today = moment().tz(timezone).startOf('day').format('YYYY-MM-DD');
      qs = {
        projectId: [projectId],
        statusId: [4],
        updatedSince: today
      };
      if (user != null) {
        qs.assigneeId = [user.id];
      }
      return get('/api/v2/issues', qs);
    }).then(function(r) {
      var message, _ref1;
      message = 'backlog-report: ' + ((_ref1 = user != null ? user.userId : void 0) != null ? _ref1 : '') + '\n' + r.json.sort(function(a, b) {
        if (a.updated < b.updated) {
          return -1;
        } else if (a.updated === b.updated) {
          return 0;
        } else {
          return 1;
        }
      }).map(function(i) {
        var hours, u, updated, url, _ref2, _ref3, _ref4;
        url = "" + baseUrl + "/view/" + i.issueKey;
        updated = moment(i.updated).tz('Asia/Tokyo').format('HH:mm');
        hours = (_ref2 = i.actualHours) != null ? _ref2 : 0;
        u = (user != null ? user.userId : void 0) ? '' : (_ref3 = i != null ? (_ref4 = i.assignee) != null ? _ref4.userId : void 0 : void 0) != null ? _ref3 : '';
        return "" + url + " " + updated + " " + hours + "h " + u + " " + i.summary;
      }).join('\n');
      return res.send(message);
    });
  });
};
