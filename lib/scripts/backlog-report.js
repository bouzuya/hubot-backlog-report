module.exports = function(robot) {
  var moment;
  moment = require('moment');
  require('hubot-arm')(robot);
  return robot.respond(/backlog-report\s+(\S+)(?:\s+(.+))?$/i, function(res) {
    var baseUrl, get, projectId, projectKey, spaceId, user, username;
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
      var qs;
      user = r.json.filter(function(i) {
        return i.userId === username;
      })[0];
      qs = {
        projectId: [projectId],
        statusId: [4],
        updatedSince: moment().startOf('day').format('YYYY-MM-DD')
      };
      if (user != null) {
        qs.assigneeId = [user.id];
      }
      return get('/api/v2/issues', qs);
    }).then(function(r) {
      var message, _ref;
      message = 'backlog-report: ' + ((_ref = user != null ? user.userId : void 0) != null ? _ref : '') + '\n' + r.json.map(function(i) {
        var hours, updated, _ref1;
        updated = moment(i.updated).format('HH:mm');
        hours = (_ref1 = i.actualHours) != null ? _ref1 : 0;
        return "" + baseUrl + "/view/" + i.issueKey + " " + updated + " " + hours + "h " + i.summary;
      }).join('\n');
      return res.send(message);
    });
  });
};
