# hubot-backlog-report

A Hubot script that display the backlog issues resolved in today.

## Installation

    $ npm install git://github.com/bouzuya/hubot-backlog-report.git

or

    $ # TAG is the package version you need.
    $ npm install 'git://github.com/bouzuya/hubot-backlog-report.git#TAG'

## Example

    bouzuya> hubot help backlog-report
      hubot> hubot backlog-report <project-key> <user> - display the backlog issues resolved in today

    bouzuya> hubot backlog-report bouzuya bouzuya
      hubot> 10:01 BOUZUYA-123 hoge
             15:23 BOUZUYA-456 fuga
             18:45 BOUZUYA-789 piyo

## Configuration

See [`src/scripts/backlog-report.coffee`](src/scripts/backlog-report.coffee).

## Development

`npm run`

## License

[MIT](LICENSE)

## Author

[bouzuya][user] &lt;[m@bouzuya.net][mail]&gt; ([http://bouzuya.net][url])

## Badges

[![Build Status][travis-badge]][travis]
[![Dependencies status][david-dm-badge]][david-dm]
[![Coverage Status][coveralls-badge]][coveralls]

[travis]: https://travis-ci.org/bouzuya/hubot-backlog-report
[travis-badge]: https://travis-ci.org/bouzuya/hubot-backlog-report.svg?branch=master
[david-dm]: https://david-dm.org/bouzuya/hubot-backlog-report
[david-dm-badge]: https://david-dm.org/bouzuya/hubot-backlog-report.png
[coveralls]: https://coveralls.io/r/bouzuya/hubot-backlog-report
[coveralls-badge]: https://img.shields.io/coveralls/bouzuya/hubot-backlog-report.svg
[user]: https://github.com/bouzuya
[mail]: mailto:m@bouzuya.net
[url]: http://bouzuya.net
