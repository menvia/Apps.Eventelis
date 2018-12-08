# Apps.Eventelis

Rocket.Chat Eventelis App. This app provides the `/eventelis` slashcommand to query event information.

You can use `/eventelis search <keyword>` to search for sessions.

![how to use the eventelis slashcommand](usage.gif?raw=true "how to use the eventelis slashcommand")

You can also use `/eventelis help` to see a list of all available commands.

## Configuration

To start using the App enter your *Eventelis API Key* and the *Event ID* of the event to made available through the slashcommand.

![how to configure the eventelis slashcommand](configuration.jpeg?raw=true "how to configure the eventelis slashcommand")

## Development Quick Start

Make sure you have https://github.com/RocketChat/Rocket.Chat.Apps-cli installed.

`npm install -g @rocket.chat/apps-cli`

Checkout this repo and install dependencies
```bash
git clone https://github.com/menvia/Apps.Eventelis.git
cd Apps.Eventelis
npm install
```

You can now make changes and build with

`rc-apps package`

And to deploy it to a local Rocket.Chat server to test the application

`rc-apps deploy -u RC_USER -p RC_PASSWORD --url=http://localhost:3000`

or to update the installation

`rc-apps deploy -f --update -u RC_USER -p RC_PASSWORD --url=http://localhost:3000`
