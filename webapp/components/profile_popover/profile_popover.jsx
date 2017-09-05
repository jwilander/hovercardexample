import React from 'react';
import PropTypes from 'prop-types';
import {makeStyleFromTheme} from 'mattermost-redux/utils/theme_utils';

export default class ProfilePopover extends React.PureComponent {
    static propTypes = {

        /*
         * Source URL from the image to display in the popover
         */
        src: PropTypes.string.isRequired,

        /*
         * User the popover is being opened for
         */
        user: PropTypes.object.isRequired,

        /*
         * Status for the user, either 'offline', 'away' or 'online'
         */
        status: PropTypes.string,

        /*
         * Set to true if the user is in a WebRTC call
         */
        isBusy: PropTypes.bool,

        /*
         * Function to call to hide the popover
         */
        hide: PropTypes.func,

        /*
         * Set to true if the popover was opened from the right-hand
         * sidebar (comment thread, search results, etc.)
         */
        isRHS: PropTypes.bool,

        /*
         * Logged in user's theme
         */
        theme: PropTypes.object.isRequired,

        /*
         * The CSS absolute left position
         */
        positionLeft: PropTypes.number.isRequired,

        /*
         * The CSS absolute top position
         */
        positionTop: PropTypes.number.isRequired,

        /* Add custom props here */

        /* Define action props here or remove if no actions */
        actions: PropTypes.shape({

            /*
             * Action to get LDAP attributes for a user
             */
            getUserLdapAttributes: PropTypes.func.isRequired
        }).isRequired

    }

    static defaultProps = {
        isBusy: false,
        hide: () => {},
        isRHS: false
    }

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            attributes: {}
        };
    }

    componentDidMount() {
        this.props.actions.getUserLdapAttributes(this.props.user.id).then(
            (results) => {
                if (results.data) {
                    this.setState({attributes: results.data});
                }
                this.setState({loading: false});
            }
        );
    }

    render() {
        const style = getStyle(this.props.theme);
        const user = this.props.user;

        let attributesContent;

        if (this.state.loading) {
            attributesContent = <li>{'Loading...'}</li>;
        } else {
            attributesContent = Object.keys(this.state.attributes).map(
                (key) => {
                    const val = this.state.attributes[key];
                    return (
                        <li key={key}><strong>{key + ': '}</strong>{val}</li>
                    );
                }
            );
        }

        return (
            <div
                style={{...style.container, left: this.props.positionLeft, top: this.props.positionTop}}
            >
                <img src={this.props.src}/>
                <ul style={style.list}>
                    <li><strong>{'Username: '}</strong>{user.username}</li>
                    <li><strong>{'First Name: '}</strong>{user.first_name}</li>
                    <li><strong>{'Last Name: '}</strong>{user.last_name}</li>
                    <li>
                        <a href={'skype:' + user.username}>
                            {'Call on '}<i className='fa fa-skype'/>
                        </a>
                    </li>
                    <br/>
                    <li><strong>{'LDAP Attributes'}</strong></li>
                    {attributesContent}
                </ul>
            </div>
        );
    }
}

const getStyle = makeStyleFromTheme((theme) => {
    return {
        container: {
            backgroundColor: theme.centerChannelBg,
            position: 'absolute',
            height: '295px',
            width: '200px',
            border: '1px solid black',
            zIndex: 9999 // Bring popover to top
        },
        list: {
            listStyleType: 'none',
            paddingLeft: '0px'
        }
    };
});
