import React, { Component } from 'react'
import { Input, Button } from 'antd'
import { socket } from '../Root'
import {connect} from 'react-redux'
import { addChatMsg, receiveChatMsg } from '../../actions/chatActions'
import PropTypes from 'prop-types'
import moment from 'moment'

const { TextArea } = Input;

class MessengerChat extends Component {
    state = {
        input: '',
        chatWith: {}
    };
    componentDidMount(){
        const {receiveChatMsg} = this.props;
        if (socket) {
            socket.on('chat', (data) => {
                //console.log(socket.id); unique socket id
                receiveChatMsg(data);
            });
        }
    };
    componentWillReceiveProps(nextProps){
        if (nextProps.chatWith.id !== this.state.chatWith.id){
            this.setState({
                chatWith: nextProps.chatWith
            })
        }
    }


    sendMsg = () => {
        const {user, addChatMsg} = this.props;
        const data = {
            recipientId: this.state.chatWith.id,
            authorId: user.user.id,
            message: this.state.input,
            time: new Date()

        };
        socket.emit('chat', data);
        addChatMsg(data);
        //TODO: save msg to back
        this.setState({
            input: ''
        });
    };

    updateText = (value) => {
        this.setState({
            input: value
        })
    };

    onEnterPress = (e) => {
        if(e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            this.sendMsg();
        }
    };

render() {
    const currentUserId = this.props.user.user.id;
    const {chatWith} = this.state;
    console.log(chatWith);
    const messages = this.props.chat;
    const msgLength = messages.length;
    return (
        <div className="chat-container">
            {!chatWith.id && (<div className="choose-chat">Choose a user to start a chat</div>)}
            { chatWith.id && (
                <div>
                <div className="chat-header">
                    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_01_green.jpg"
                         alt="avatar" />
                    <div className="chat-header-about">
                        <div className="chat-header-with">Chat with {`${chatWith.firstname}, ${chatWith.lastname}`}</div>
                        <div className="chat-header-num-messages">
                            {msgLength > 0 ? `${msgLength} messages` : 'not messages yet'}
                        </div>
                    </div>
                </div>
                <div className="chat-history">

                <ul className="chat-history-list">
            {messages.map(message =>
                <li key={message.id} className="history-list-message">
                <div className="message-data">
                <span className="message-data-name">{currentUserId !== message.authorId ? `${chatWith.username}`
                    : 'me'} </span>
                <span className="message-data-time">{moment(message.time).fromNow()}</span>
                </div>
                <div className={"message " + (currentUserId !== message.authorId ? "other-message float-right"
                : "my-message")}>{message.message}</div>
                </li>
                )}
                </ul>
            </div>
            <div className="chat-message">
            <TextArea value={this.state.input} rows={1} placeholder ="Type your message"
            onKeyDown={this.onEnterPress} onChange={(e) => this.updateText(e.target.value)}/>
            <Button onClick={this.sendMsg} className="center-button-chat" type="primary">Send</Button>
            </div>
        </div>
        )}
        </div>
    );
  }
};

function mapStateToProps({user, chat}) {
    return {user, chat};
}

MessengerChat.propTypes = {
    user: PropTypes.object,
    chat: PropTypes.array,
    addChatMsg: PropTypes.func.isRequired,
    receiveChatMsg: PropTypes.func.isRequired
}
export default connect(mapStateToProps, { addChatMsg,receiveChatMsg })(MessengerChat);