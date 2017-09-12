import React from 'react';
import PropTypes from 'prop-types';
import {makeStyleFromTheme, changeOpacity} from 'mattermost-redux/utils/theme_utils';

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
            attributesContent = 'Loading...';
        } else if (Object.keys(this.state.attributes).length === 0) {
            attributesContent = 'LDAP plugin not configured.';
        } else {
            attributesContent = Object.keys(this.state.attributes).map(
                (key) => {
                    const val = this.state.attributes[key];
                    return (
                        <div
                            key={key}
                            className='overflow--ellipsis padding-bottom text-nowrap'
                        >
                            {key + ': ' + val}
                        </div>
                    );
                }
            );
        }

        return (
            <div
                style={{...style.container, left: this.props.positionLeft, top: this.props.positionTop}}
            >
                <h3 style={style.title}><a>{user.username}</a></h3>
                <div style={style.content}>
                    <img
                        style={style.img}
                        src={this.props.src}
                    />
                    <div style={style.fullName}>
                        {user.first_name + ' ' + user.last_name}
                    </div>
                    <hr style={{margin: '0px -15px 10px'}}/>
                    <div style={{paddingBottom: '7px'}}>
                        <strong>{'LDAP Attributes'}</strong>
                    </div>
                    {attributesContent}
                    <hr style={{margin: '10px -15px 10px'}}/>
                    <a href={'skype:' + user.username}>
                        <i className='fa fa-skype'/>{' Call on Skype'}
                    </a>
                </div>
            </div>
        );
    }
}

const getStyle = makeStyleFromTheme((theme) => {
    return {
        container: {
            backgroundColor: theme.centerChannelBg,
            position: 'absolute',
            border: '1px solid ' + changeOpacity(theme.centerChannelColor, 0.2),
            borderRadius: '4px',
            zIndex: 9999 // Bring popover to top
        },
        title: {
            padding: '8px 14px',
            margin: '0',
            fontSize: '14px',
            backgroundColor: changeOpacity(theme.centerChannelBg, 0.2),
            borderBottom: '1px solid #ebebeb',
            borderRadius: '5px 5px 0 0'
        },
        content: {
            padding: '9px 14px'
        },
        img: {
            verticalAlign: 'middle',
            maxWidth: '100%',
            borderRadius: '128px',
            margin: '0 0 10px'
        },
        fullName: {
            overflow: 'hidden',
            paddingBottom: '7px',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
        }
    };
});
