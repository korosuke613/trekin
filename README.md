# trekin
A npm library that connects Trello to kintone.

[![npm version](https://badge.fury.io/js/trekin.svg)](https://www.npmjs.com/package/trekin) [![CI](https://github.com/korosuke613/trekin/workflows/CI/badge.svg)](https://github.com/korosuke613/trekin/actions?query=workflow%3ACI) [![codecov](https://codecov.io/gh/korosuke613/trekin/branch/master/graph/badge.svg?token=5lTvndP77g)](https://codecov.io/gh/korosuke613/trekin)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fkorosuke613%2Ftrekin.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fkorosuke613%2Ftrekin?ref=badge_shield)


## Installation

Use the package manager [npm](https://docs.npmjs.com/about-npm/) to install trekin.

```bash
npm i trekin
```

## Setup


## Usage

```typescript
import { Trekin } from "trekin";

  const trekin = new Trekin(
    {
      baseUrl: "https://example.cybozu.com/", // Your domain
      defaultKintoneUserCode: "john",  // Your kintone user code
      cards: {
        id: "1", // Your kintone app ID for Card
        token: "...", // Your kintone app API token for Card
      },
      labels: {
        id: "2", // Your kintone app ID for Label
        token: "...", // Your kintone app API token for Label
      },
      lists: {
        id: "3", // Your kintone app ID for List
        token: "...", // Your kintone app API token for List
      },
      members: {
        id: "4", // Your kintone app ID for Member
        token: "...", // Your kintone app API token for Member
      },
    },
    {
      apiKey: "...", // Your Trello user API key
      apiToken: "...", // Your Trello user API token
    }
  );

  const result = await trekin.operation(trelloWebhookAction);
  console.info("Operation\n" + JSON.stringify(result));
  const postResult = await trekin.postOperation(trelloWebhookAction);
  console.info("Post operation\n" + JSON.stringify(postResult));
```


## License
[MIT](https://choosealicense.com/licenses/mit/)

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fkorosuke613%2Ftrekin.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fkorosuke613%2Ftrekin?ref=badge_large)