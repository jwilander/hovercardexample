# Mattermost Hovercard Example Plugin

**Only works with Mattermost versions before 5.2**

An example plugin that overrides the profile popover (aka hovercard) of the Mattermost webapp.

Template generated using the [Mattermost Developer Kit tool](https://www.npmjs.com/package/mdk).

## Requirements

Must have [npm](https://www.npmjs.com/) installed.

## Usage

1. Clone this repository:
```
git clone https://github.com/jwilander/hovercardexample.git
```
2. Change into the repository directory and build:
```
cd hovercardexample
make build
```
3. Upload the plugin at `dist/hovercardexample.tar.gz` to your Mattermost server, [with plugins enabled](https://docs.google.com/document/d/17twWiy1AtlMC_h_sgJCoeaj3syz9njcY_n7U8gtT3O8/edit#bookmark=id.sfj0fvfr9bt8)

4. (Optional) To display additional LDAP attributes on the hovercard, [enable the built-in ldapextras plugin](https://docs.google.com/document/d/17twWiy1AtlMC_h_sgJCoeaj3syz9njcY_n7U8gtT3O8/edit#bookmark=id.qrdmv3bpd470)

## How this plugin was made

1. Used the [mdk tool](https://www.npmjs.com/package/mdk) to generate the template:

```
$ mdk init plugin
Plugin Generation

Plugin name: HovercardExample
Description: Example hovercard plugin with Skype and LDAP integration

Webapp

? Override Components:  ProfilePopover
Post Types (comma separated, leave blank to skip): 

Plugin generated at: /path/to/plugins/hovercardexample
```

2. Modified [`webapp/client/client.js`](https://github.com/jwilander/hovercardexample/blob/master/webapp/client/client.js) to send a request to the LDAP Mattermost plugin. Note that authentication is handled by existing cookies.
  * Set `url` in the constructor to `window.location.origin`, which will be the Mattermost URL.
  * Created the `getUserLdapAttributes()` async function to make a request to the built-in LDAP plugin.
3. Added a Redux-style action in [`webapp/actions/actions.js`](https://github.com/jwilander/hovercardexample/blob/master/webapp/actions/actions.js), named `getUserLdapAttributes`. The action:
  * Awaits on the `getUserLdapAttributes()` client function created in step 2. 
  * Returns an object with data and error as necessary.
4. Modified the hovercard container at [`webapp/components/profile_popver/index.js`](https://github.com/jwilander/hovercardexample/blob/master/webapp/components/profile_popover/index.js).
  * [Imported](https://github.com/jwilander/hovercardexample/blob/master/webapp/components/profile_popover/index.js#L3) the `getUserLdapAttributes` action and [passed it to the action props](https://github.com/jwilander/hovercardexample/blob/master/webapp/components/profile_popover/index.js#L15) of the component.
5. Modifed the hovercard component at [`webapp/components/profile_popver/profile_popover.jsx`](https://github.com/jwilander/hovercardexample/blob/master/webapp/components/profile_popover/profile_popover.jsx).
  * Added an [action prop definition for `getUserLdapAttributes`](https://github.com/jwilander/hovercardexample/blob/master/webapp/components/profile_popover/profile_popover.jsx#L62).
  * Added `loading` and `attributes` fields to state.
  * Added [React lifecycle function componentDidMount()](https://facebook.github.io/react/docs/react-component.html#componentdidmount) and used the action to populate state.
  * Updated the [`render()` function](https://github.com/jwilander/hovercardexample/blob/master/webapp/components/profile_popover/profile_popover.jsx#L93) to display user information.
    * Skype call link created with `<a href="skype:<username>"</a>`. For Skype for Business, this can be updated to `<a href="sip:<username>@<domain>"</a>`.
    * Added loading indicator and displayed LDAP attributes when loading complete.
  * Added a list CSS style under the `getStyle` function and used it for the `<ul>` tag in the `render()` function.
6. Ran `make build` and uploaded it to a Mattermost server for testing.
