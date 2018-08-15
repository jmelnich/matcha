import React, { Component } from 'react'
import '../../../node_modules/antd/dist/antd.css'
import  '../css/styles'
import {Layout} from 'antd'
import Profile from './Profile/Profile'
import Home from './Home'
import {getUser} from '../actions/userActions'
import {connect} from 'react-redux'
import HeaderNav from './HeaderNav'
import {Route, Switch} from 'react-router-dom'
import Search from './Search/Search'
import PropTypes from 'prop-types'
import Activation from './Activation'
import SetPassword from './Additional/SetPassword'
import Match from './Match'
import NotFound from './UI/NotFound'
import Messenger from './Messenger/Messenger'
import OtherUserProfile from './Profile/OtherUserProfile'
import Notifications from './Notifications'
import openSocket from 'socket.io-client'
import {getBaseURL} from '../config'
import {getMessageHistory} from '../actions/chatActions'
import {fetchHistory} from '../actions/historyActions'

export const socket = openSocket.connect(getBaseURL());

class Root extends Component {
    componentDidMount() {
        this.props.isAuth();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.user.id !== this.props.user.id){
            /* SETUP new socket connection */
            const {id} = this.props.user;
            socket.emit('users', id);
            /* GRAB chat messages */
            this.props.getMessageHistory(id);
            this.props.fetchHistory();
        }
    }
    render() {
        const {Footer} = Layout;
        return (
            //TODO: render pages only when user logged  in
            <Layout className="App">
                <HeaderNav/>
                <Switch>
                    <Route exact path='/' component={this.props.auth ? Profile : Home}/>
                    <Route exact path='/search' component={Search}/> //TODO: handle /search/
                    <Route exact path='/match' component={Match}/>
                    <Route exact path='/messenger' component={Messenger}/>
                    <Route exact path='/activate/:token' component={Activation} />
                    <Route exact path='/password/:token' component={SetPassword} />
                    <Route exact path='/user/:id' component={OtherUserProfile} />
                    <Route exact path='/notifications' component={Notifications} />
                    <Route component={NotFound}/>
                </Switch>
                <Footer>&copy; by imelnych & pkolomiy</Footer>
            </Layout>
        );
      }
};

function mapStateToProps({user}) {
    return user;
}

function mapDispatchToProps(dispatch) {
    return {
        isAuth: () => dispatch(getUser()),
        getMessageHistory: (id) => dispatch(getMessageHistory(id)),
        fetchHistory: () => dispatch(fetchHistory())
    }
};

Root.propTypes = {
    getUser: PropTypes.func,
    getMessageHistory: PropTypes.func,
    fetchHistory: PropTypes.func,
    user: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(Root);


