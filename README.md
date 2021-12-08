# 동네대회 (미니게임)

[![Main-branch (Production) deploy actions](https://github.com/karrotmvp/minigame-client/actions/workflows/main-deploy.yml/badge.svg?branch=main)](https://github.com/karrotmvp/minigame-client/actions/workflows/main-deploy.yml)

### Environment variables
- BASE_URL: backend server url
- APP_ID: app-id generated from daangn partner center
- MINI_PRESET: daangn third-party agreement url
- MINI_INSTALLATION_URL: daangn subscribe suggestion url
- FIREBASE_*: configurations for Firebase Analytics
```
REACT_APP_BASE_URL=""
REACT_APP_APP_ID=""
REACT_APP_MINI_PRESET=""
REACT_APP_MINI_INSTALLATION_URL=""
REACT_APP_FIREBASE_API_KEY=""
REACT_APP_FIREBASE_AUTH_DOMAIN=""
REACT_APP_FIREBASE_PROJECT_ID=""
REACT_APP_FIREBASE_STORAGE_BUCKET=""
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=""
REACT_APP_FIREBASE_APP_ID=""
REACT_APP_FIREBASE_MEASUREMENT_ID=""
```


### Analytics
Firebase Analytics is used to track user activities, mainly button click actions.
