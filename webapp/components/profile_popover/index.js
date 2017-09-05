import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getUserLdapAttributes} from 'actions/actions.js';

import ProfilePopover from './profile_popover.jsx';

function mapStateToProps(state, ownProps) {
    return {
        ...ownProps
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            getUserLdapAttributes
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePopover);
