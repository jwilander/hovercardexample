# Mattermost Hovercard Example Plugin

An example plugin that overrides the profile popover (aka hovercard) of the Mattermost webapp.

Template generated using the [Mattermost Developer Kit tool](https://www.npmjs.com/package/mdk).

## Requirements

Must have [npm](https://www.npmjs.com/) installed.

## Usage

1. Clone this repository
```
git clone https://github.com/jwilander/hovercardexample.git
```
2. Change into the repository directory and build
```
cd hovercardexample
make build
```
3. Upload the plugin at `dist/hovercardexample.tar.gz` to your Mattermost server

4. (Optional) To get LDAP attributes to display, [you need to enable the built-in ldapextras plugin](link goes here)

## How this plugin was made

1. Used the [mdk tool](https://www.npmjs.com/package/mdk) to generate the starting point
```
$ mdk init webapp
Performing setup for webapp plugin...
Plugin name: HovercardExample
Description: Example hovercard plugin with Skype and LDAP integration
? What components would you like to override with your plugin?
❯◉ ProfilePopover
Plugin generated at: ./hovercardexample
```

2. Modified `webapp/client/client.js` to send a request to the LDAP Mattermost plugin
  * Set `url` in the constructor to `window.location.origin`, which will be the Mattermost URL
  * Created the `getUserLdapAttributes()` async function to make a request to the built-in LDAP plugin
  * Authentication handled by existing cookies
3. Added a Redux-style action in `webapp/actions/actions.js` named `getUserLdapAttributes`
  * Awaits on the client function just made in the last step
  * Returns an object with data and error populated as necessary
4. Modified the hovercard container at `webapp/components/profile_popver/index.js`
  * Imported the `getUserLdapAttributes` action and passed it to the action props of the component
5. Modifed the hovercard component at `webapp/components/profile_popver/profile_popover.jsx`
  * Added an action prop definition for `getUserLdapAttributes`
  * Added `loading` and `attributes` fields to state
  * Added [React lifecycle function componentDidMount()](https://facebook.github.io/react/docs/react-component.html#componentdidmount) and used the action to populate state
  * Updated the `render()` function to display user information
    * Skype call link created with `<a href="skype:<username>"</a>`. For Skype for Business, this can be updated to `<a href="sip:<username>@<domain>"</a>`
    * Added loading indicator and displayed LDAP attributes when loading complete
  * Added a list CSS style under the `getStyle` function and used it for the `<ul>` tag in the `render()` function
6. Ran `make build` and uploaded it to a Mattermost server for testing
