# trekin
A npm library that connects Trello to kintone.

[![npm version](https://badge.fury.io/js/trekin.svg)](https://www.npmjs.com/package/trekin) [![CI](https://github.com/korosuke613/trekin/workflows/CI/badge.svg)](https://github.com/korosuke613/trekin/actions?query=workflow%3ACI) [![codecov](https://codecov.io/gh/korosuke613/trekin/branch/master/graph/badge.svg?token=5lTvndP77g)](https://codecov.io/gh/korosuke613/trekin)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fkorosuke613%2Ftrekin.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fkorosuke613%2Ftrekin?ref=badge_shield)


## Installation

Use the package manager [npm](https://docs.npmjs.com/about-npm/) to install trekin.

```bash
npm i trekin
```

## Sample
Please read this repository.

https://github.com/korosuke613/trekin-sample

## Supported Trello events
- createCard
- updateCard
- copyCard
- createList
- updateList
- createLabel
- updateLabel
- addLabelToCard
- removeLabelFromCard
- addMemberToCard
- removeMemberFromCard
- commentCard

## Usage

### Instantiation Trekin
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
```

### Storing Trello events in Objects
Turn [Trello's webhook response](https://developer.atlassian.com/cloud/trello/guides/rest-api/webhooks/#example-webhook-response) into an object.

```typescript
const trelloWebhookAction: Action = JSON.parse(
  await fs.readFileSync("trelloEvent.json", "utf8")
).body.action;
```

### Post Trello events to kintone

```typescript
const result = await trekin.operation(trelloWebhookAction);
console.info("Operation\n" + JSON.stringify(result));
```

### Post kintone events to Trello

```typescript
const postResult = await trekin.postOperation(trelloWebhookAction);
console.info("Post operation\n" + JSON.stringify(postResult));
```

### Setting of trekin

#### Exclude Card
Trekin support Card exclusion settings.
If all the conditions enclosed in braces are met, the event is skipped.

```typescript
trekin.guardian.setting = {
  excludes: [
    {
      charactersOrLess: 12,
      match: "\\d{2}\\/\\d{2}\\/\\d{4}",
    },
    {
      match: "Test!!"
    }
  ],
};
```

- Card name is *⬆️27/09/2020*, skip.
- Card name is *Prepare for the event on 27/09/2020.*, not skip.
- Card name is *This is createCard Test!!*, skip.

##### Exclude option list

|option|type|description|
|---|---|---|
|charactersOrLess|number|If the card name is less than or equal to the set value, exclude it.|
|match|regexp|If the card name matches to the set regular expression, exclude it.|


## License
[MIT](https://choosealicense.com/licenses/mit/)

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fkorosuke613%2Ftrekin.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fkorosuke613%2Ftrekin?ref=badge_large)