## Development workflow

1. Log into facebook (meta).
2. Log into developers.facebook.com.
3. Search for your app and its Whatsapp product that you added to it.
4. Load the "App Dashboard".
    - Note: URL is something like `https://developers.facebook.com/apps/<APP-ID>/whatsapp-business/wa-dev-console/?business_id=<WHATSAPP-BUSINESS-ID>`
5. (Re)generate the Access Token.
    - Note: This access token constantly expires (every couple hours or something).
6. Set it in the appropriate environment variable.
    - Eg. Env vars settings in the Vercel lambda.
    - Note: URL is something like `https://vercel.com/<YOUR-GITHUB-REPO>-projects/<REPO-NAME>/settings/environment-variables`.

## Infra

### Vercel

#### Docs

https://vercel.com/docs/functions/runtimes/node-js

## WhatsApp API Rules

https://www.facebookblueprint.com/student/collection/409587/path/360219/activity/328686#/page/61dc9aed7ecb160d3547eff5

1. Customer Service Window:
    - Whenever someone messages a business on WhatsApp, a 24-hour timer starts (or refreshes, if one has already started).
    - Within the window, the support bot may reply with both template and free-form messages.
    - Outside the window, the support bot may reply with only template messages.
    - (Template messages have to be verified by Meta. Eg. of a template message: hello_world)
1. Consent:
    - Business-initiated conversations must obtain individual customer consent. 
    - The opt-in notification must state that the person agrees to receive messages from the business through WhatsApp. 
    - You also need to include the name of the business. 
1. Automation:
    - You can use automation to respond during the 24-hour customer service window.
    - You must give the recipient a prompt, clear and direct method for escalating to a live agent.
1. Limits:
    - Business phone numbers are initially limited to 250 business-initiated conversations in a 24-hour moving period.
    - You can increase your messaging limit to 1,000 on your own.

## WhatsApp API Tips

### Messaging

1. Use free-form messages during customer service windows whenever possible, since these types of messages have the least restrictions.

