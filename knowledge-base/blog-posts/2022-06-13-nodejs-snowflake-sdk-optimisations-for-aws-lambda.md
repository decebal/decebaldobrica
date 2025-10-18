---
title: Nodejs Snowflake Sdk Optimisations for Aws Lambda
date: '2022-06-14T05:00:00.000Z'
author: Decebal D.
description: Using Snowflake as an analytics pool consumed by aws lambda.
tags:
  - snowflake
  - serverless
  - typescript
  - aws
  - aws lambda
slug: 2022-06-13-nodejs-snowflake-sdk-optimisations-for-aws-lambda
canonicalUrl: >-
  https://decebalonprogramming.net/post/2022-06-13-nodejs-snowflake-sdk-optimisations-for-aws-lambda
---

### Current setup:

We are using **snowflake-promise** as a wrapper to **snowflake-sdk** in an **appsync lambda resolver**.


### Issues with current setup:

1. Not being able to use a connection pool (results in )

```
Error [ClientError]: Connection already in progress.
```

2. OCP Cache

```
Reading OCSP cache file. /home/sbx_user1051/.cache/snowflake/ocsp_response_cache.json"

Failed to read OCSP cache file: /home/sbx_user1051/.cache/snowflake/ocsp_response_cache.json, err: Error: ENOENT: no such file or directory, open '/home/sbx_user1051/.cache/snowflake/ocsp_response_cache.json'\n    at Object.openSync (fs.js:498:3)\n    at Object.readFileSync (fs.js:394:35)\n    at new OcspResponseCache (/var/task/webpack:/node_modules/snowflake-promise/node_modules/snowflake-sdk/lib/agent/ocsp_response_cache.js:79:1)\n    at getOcspResponseCache (/var/task/webpack:/node_modules/snowf"

Contact OCSP Cache Server: http://ocsp.snowflakecomputing.com/ocsp_response_cache.json"
Finish OCSP Cache Server: http://ocsp.snowflakecomputing.com/ocsp_response_cache.json"


/home/sbx_user1051/.cache/snowflake/ocsp_response_cache.json"
Writing OCSP cache file. /home/sbx_user1051/.cache/snowflake/ocsp_response_cache.json"
Failed to update OCSP cache file: /home/sbx_user1051/.cache/snowflake/ocsp_response_cache.json, err: Error: ENOENT: no such file or directory, open '/home/sbx_user1051/.cache/snowflake/ocsp_response_cache.json'\n    at Object.openSync (fs.js:498:3)\n    at Object.writeFileSync (fs.js:1529:35)\n    at OcspResponseCache.resetCacheStatus (/var/task/webpack:/node_modules/snowflake-promise/node_modules/snowflake-sdk/lib/agent/ocsp_response_cache.js:138:1)\n    at /var/task/webpack:/node_modules/snowflake"
```

3. [Npm package is not up to date](https://github.com/natesilva/snowflake-promise/pulls) (Last publish: a year ago) and snowflake sdk’s latest updates are not available as a [couple](https://github.com/natesilva/snowflake-promise/compare/master...flydata:master) of different forks have tried to [signal](https://github.com/natesilva/snowflake-promise/compare/master...timfenten:master)

### Has anyone tried to solve these issues before ?

1. Making the snowflake-sdk async

  - [AWS Lambda NodeJs with Snowflake](https://medium.com/@mazurkiewiczpw/aws-lambda-nodejs-with-snowflake-b5fdb35896e5)
  - [snowflake-promise](https://www.npmjs.com/package/snowflake-promise)

2. Using a connection Pool

  - [snowflake-promise fork](https://github.com/natesilva/snowflake-promise/pull/19/files)
  - an open PR has suggested using a `isUp` method, which I merged on the fork above, but it did not make a difference in my case
  - I tried using a [Connection Pool](https://github.com/Tellimer/snowflake-sdk-promise/blob/master/src/SnowflakePool.ts), which worked well for our case

3. OCSP Cache

  - can be [be turned off](https://www.snowflake.com/blog/latest-changes-to-how-snowflake-handles-ocsp/)
  - [HOW TO: TURN OFF OCSP CHECKING IN SNOWFLAKE CLIENT DRIVERS](https://community.snowflake.com/s/article/How-to-turn-off-OCSP-checking-in-Snowflake-client-drivers)
  - having the check happen on each request is rather useless, following these [best practices](https://docs.snowflake.com/en/user-guide/ocsp.html#best-practices) should mitigate and eliminate the need for the OCSP check
