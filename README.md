# Dropbox Portfolio

## What is it?

TODO

## Getting Started

TODO ENV VARIABLES

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Setup a Dropbox shared folder and application account

TODO

Step1 from Browser: https://www.dropbox.com/oauth2/authorize?token_access_type=offline&response_type=code&client_id=<App key>
Step2: curl https://api.dropbox.com/oauth2/token -d code=<received code> -d grant_type=authorization_code -u <App key>:<App secret>


## Dropbox folder structure

TODO




------------

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

https://www.dropbox.com/scl/fo/ol9kgbjhvifvtc99pteq9/h?rlkey=5qaajjv99mh03krihciczalyo&dl=0

Step1 from Browser: https://www.dropbox.com/oauth2/authorize?token_access_type=offline&response_type=code&client_id=<App key>
Step2: curl https://api.dropbox.com/oauth2/token -d code=<received code> -d grant_type=authorization_code -u <App key>:<App secret>


https://www.dropbox.com/oauth2/authorize?token_access_type=offline&response_type=code&client_id=dndk0v5e3cioyxu
curl https://api.dropbox.com/oauth2/token -d code=ZEpYkKus14gAAAAAAAAAHYqabev_-x5Ux2-jZaq4Pm8 -d grant_type=authorization_code -u 3bvdc9aga1omg39:c1am05vts46jgib


{"access_token": "sl.BlyK69WMdIg_sQkdGrOUC7HvJ-G_Ie3PSnNFwh9bvMomu-S_iSM8Sh2Z74euJNBBBGoT5oMcTvYuDZaEq7h7w2HSr8eglMvxupMJd8gGeJSNOIRq5XplPNC0GmLZuk4wSojaUWnxrH0R", "token_type": "bearer", "expires_in": 14400, "refresh_token": "j8fzXbQU9ZAAAAAAAAAAAeOcoBcRxGXlQlnP4QZ6Cf7wk4Dj0uOvnQeI50tI3YQj", "scope": "account_info.read", "uid": "1935283441", "account_id": "dbid:AACGZk7Q7hb_Ybe3FZhZd8SIDaPxZtmNUyc"}


{"access_token": "sl.Bl2DwrCNnotQxcHR50kk6lCVtxOvrIT7Dg5ylF8moRX5g5nH9d1gCns7Z8rpAeOOpleXeXQtp1Rc_8Jq-Fce3eDc21UZpLCUGYDXZfTVqcb_LXR4tDA2YWcWD-jDZSmx6XCfg49xf6VY", "token_type": "bearer", "expires_in": 14400, "refresh_token": "hYIDH5ZpoAkAAAAAAAAAAZrENslHbnETO2BVQ4tqW3Hix3mnRXUdes3DTduxI5J-", "scope": "account_info.read files.content.read files.metadata.read sharing.read", "uid": "1935283441", "account_id": "dbid:AACGZk7Q7hb_Ybe3FZhZd8SIDaPxZtmNUyc"}



https://www.dropbox.com/sh/c0y8xswir5gtj76/AADOlVmuSqFMjGdmB-HhZ_ura?dl=0

https://www.dropbox.com/scl/fo/c0y8xswir5gtj76/h?rlkey=AADOlVmuSqFMjGdmB-HhZ_ura&dl=0


