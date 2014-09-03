# Description
#   A Hubot script that display the backlog issues resolved in today.
#
# Dependencies:
#   None
#
# Configuration:
#   None
#
# Commands:
#   hubot backlog-report <project-key> [<user>] - display the backlog issues resolved in today
#
# Author:
#   bouzuya <m@bouzuya.net>
#
module.exports = (robot) ->
  moment = require 'moment-timezone'
  require('hubot-arm') robot

  robot.respond /backlog-report\s+(\S+)(?:\s+(.+))?$/i, (res) ->
    timezone = process.env.HUBOT_BACKLOG_REPORT_TIMEZONE ? 'Asia/Tokyo'
    spaceId = process.env.HUBOT_BACKLOG_REPORT_SPACE_ID
    projectKey = res.match[1].toUpperCase()
    username = res.match[2]

    baseUrl = "https://#{spaceId}.backlog.jp"
    projectId = null
    user = null

    get = (path, qs={}) ->
      qs.apiKey = process.env.HUBOT_BACKLOG_REPORT_API_KEY
      res.robot.arm('request')
        method: 'GET'
        url: baseUrl + path
        qs: qs
        format: 'json'

    get "/api/v2/projects/#{projectKey}"
    .then (r) ->
      projectId = r.json.id
      get "/api/v2/projects/#{projectKey}/users"
    .then (r) ->
      user = r.json.filter((i) -> i.userId is username)[0]
      today = moment().tz(timezone).startOf('day').format('YYYY-MM-DD')
      qs =
        projectId: [projectId]
        statusId: [4] # resolved
        updatedSince: today
      qs.assigneeId = [user.id] if user?
      get '/api/v2/issues', qs
    .then (r) ->
      message = 'backlog-report: ' + (user?.userId ? '') + '\n' +
      r.json.sort((a, b) ->
        if a.updated < b.updated
          -1
        else if a.updated is b.updated
          0
        else
          1
      ).map((i) ->
        url = "#{baseUrl}/view/#{i.issueKey}"
        updated = moment(i.updated).tz('Asia/Tokyo').format('HH:mm')
        hours = i.actualHours ? 0
        u = if user?.userId then '' else (i?.assignee?.userId ? '')
        "#{url} #{updated} #{hours}h #{u} #{i.summary}"
      ).join('\n')
      res.send message
