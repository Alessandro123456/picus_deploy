import React, {Component} from 'react';
import {Launcher} from '../../src';
import '../assets/styles';

class Chatbot extends Component {

  constructor(props) {
    super(props);
    this.state = {
      messageList: [],
      newMessagesCount: 0,
      isOpen: false,
      alreadycreate: false,
      create_socket: false,
      ws: null,
      flag : false,
      videoEl : null
    };
  }

  attemptPlay = () => {
    this.state.videoEl &&
    this.state.videoEl.document &&
    this.state.videoEl.document.quarySelector('video').play().catch(error => {
        console.error("Error attempting to play", error);
      });
  };

  componentDidMount() {
    this.attemptPlay()
  }

  componentWillUnmount() {

  }

  createsocket() {
    //gli input all'interno della socket stanno nel file UserInput.js
		if (!this.state.alreadycreate && this.props.flag ) {
        this.props.ws.onopen = () => {          
          this.props.ws.send(this.props.keycloak.profile.firstName+" "+ this.props.email+" "+this.props.keycloak.resourceAccess.react_app.roles[0])
          this.setState({isOpen: !this.state.isOpen})
        }
				this.props.ws.onmessage = msg => {
          var struttura = {
              author: 'them',
              type: 'text',
              data: { text: msg.data }
            }
            
            this.setState({
              messageList: [...this.state.messageList, struttura]
            });
           }
      this.setState({ alreadycreate: true });
				}
		
}

  _onMessageWasSent(message) {
    this.setState({
      messageList: [...this.state.messageList, message]
    });
  }

  _onFilesSelected(fileList) {
    const objectURL = window.URL.createObjectURL(fileList[0]);
    this.setState({
      messageList: [...this.state.messageList, {
        type: 'file', author: 'me',
        data: {
          url: objectURL,
          fileName: fileList[0].name
        }
      }]
    });
  }

  _sendMessage(text) {
    if (text.length > 0) {
      const newMessagesCount = this.state.isOpen ? this.state.newMessagesCount : this.state.newMessagesCount + 1;
      this.setState({
        newMessagesCount: newMessagesCount,
        messageList: [...this.state.messageList, {
          author: 'them',
          type: 'text',
          data: { text }
        }]
      });
    }
  }

  _handleClick() {
    this.setState({
      isOpen: !this.state.isOpen,
      newMessagesCount: 0
    });
  }


  render() {
    return (
    <div id="chatbot">
      {this.createsocket()}

      {this.state.alreadycreate &&
      <Launcher
        ws = {this.props.ws}
        agentProfile={{
          teamName: 'Picus'
        }}
        onMessageWasSent={this._onMessageWasSent.bind(this)}
        onFilesSelected={this._onFilesSelected.bind(this)}
        messageList={this.state.messageList}
        newMessagesCount={this.state.newMessagesCount}
        handleClick={this._handleClick.bind(this)}
        isOpen={this.state.isOpen}
        showEmoji
        ref={this.state.videoEl}
      />
      }
            
    </div>
    );
  }
}


export default Chatbot;
