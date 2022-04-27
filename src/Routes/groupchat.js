import { CometChat } from "@cometchat-pro/chat"
import { useEffect, useState } from "react"
import MDSpinner from "react-md-spinner"


const MESSAGE_LISTENER_KEY= 'listener-key'
const limit = 30


export const Group =({user})=> {
    const [friends,setFriends] = useState([])
    const [selectedFriend, setSelectedFriend] = useState(null)
    const [chat, setChat] = useState([])
    const [chatIsLoading, setChatIsLoading] = useState(false)
    const [friendisLoading, setFriendIsLoading] = useState(true)
    const [message, setMessage] = useState('')

useEffect(() => {
    let usersRequest = new CometChat.UsersRequestBuilder()
    .setLimit(limit)
    .build()

    usersRequest.fetchNext().then(
        userList => {
            console.log('User list received:', userList)
            setFriends(userList)
            setFriendIsLoading(false)
        },
        error => {
            console.log('Error while fetching:',error)
        }
    )
    return () => {
        CometChat.removeMessageListener(MESSAGE_LISTENER_KEY)
        CometChat.logout()
    }
}, [])


//runs when selectedfriend is updates and would fetch previous messages and also create a new listener for incoming message
useEffect(()=> {

    if (selectedFriend) {
        let messagesRequest = new CometChat.MessagesRequestBuilder()
        .setUID(selectedFriend)
        .setLimit(limit)
        .build()

        messagesRequest.fetchPrevious().then(
            messages => {
                setChat(messages)
                setChatIsLoading(false)
                scrollToBottom()
            },
            error => {
                console.log('Message fetching failed:',error)
            }
        )
        CometChat.removeMessageListener(MESSAGE_LISTENER_KEY)
        CometChat.addMessageListener(MESSAGE_LISTENER_KEY,
            new CometChat.MessageListener({
                onTextMessageReceived: message => {
                    console.log('Incoming Message Log',{message})
                    if (selectedFriend === message.sender.uid) {
                        setChat(prevState => [...prevState,message])
                    }
                }
            })
            )
    }
}, [selectedFriend])

const handleSubmit = e => {
    e.preventDefault()
    let textMessage = new CometChat.TextMessage(
        selectedFriend,
        message,
        CometChat.MESSAGE_TYPE.TEXT,
        CometChat.RECEIVER_TYPE.USER
    )

    CometChat.sendMessage(textMessage).then(
        message => {
            console.log('Message sent successfully:', message)
            setChat([...chat, message])
        },
        error => {
            console.log('Message sending failed:',error)
        }
    )
    setMessage('')
}

const selectFriend = uid => {
    setSelectedFriend(uid)
    setChat([])
    setChatIsLoading(true)
}
const scrollToBottom = () => {
    let node = document.getElementById('ccChatBoxEnd');
    node.scrollIntoView();
  };




    return ( <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-2' />
        <div className='col-md-8 h-100pr border rounded'>
          <div className='row'>
            <div className='col-lg-4 col-xs-12 bg-light' style={{height: 658}}>
              <div className='row p-3'>
                <h3>Friend List</h3>
              </div>
              <div
                className='row ml-0 mr-0 h-75 bg-white border rounded'
                style={{height: '100%', overflow: 'auto'}}>
                <FriendList
                  friends={friends}
                  friendisLoading={friendisLoading}
                  selectedFriend={selectedFriend}
                  selectFriend={selectFriend}
                />
              </div>
            </div>
            <div className='col-lg-8 col-xs-12 bg-light' style={{height: 658}}>
              <div className='row p-3 bg-white'>
                <h3>Send a message to a friend</h3>
              </div>
              <div
                className='row pt-5 bg-white'
                style={{height: 500, overflow: 'auto'}}>
                <ChatBox
                  chat={chat}
                  chatIsLoading={chatIsLoading}
                  user={user}
                />
              </div>
              <div className='row bg-light' style={{bottom: 0, width: '100%'}}>
                <form className='row m-0 p-0 w-100' onSubmit={handleSubmit}>
                  <div className='col-9 m-0 p-1'>
                    <input
                      id='text'
                      className='mw-100 border rounded form-control'
                      type='text'
                      onChange={event => {
                        setMessage(event.target.value);
                      }}
                      value={message}
                      placeholder='Type a message...'
                    />
                  </div>
                  <div className='col-3 m-0 p-1'>
                    <button
                      className='btn btn-outline-secondary rounded border w-100'
                      title='Send'
                      style={{paddingRight: 16}}>
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ChatBox = props => {
    const {chat, chatIsLoading, user} = props;
    if (chatIsLoading) {
      return (
        <div className='col-xl-12 my-auto text-center'>
          <MDSpinner size='72' />
        </div>
      );
    } else {
      return (
        <div className='col-xl-12'>
          {chat.map(chat => (
            <div key={chat.id} className='message'>
              <div
                className={`${
                  chat.receiver !== user.uid ? 'balon1' : 'balon2'
                } p-3 m-1`}>
                {chat.text}
              </div>
            </div>
          ))}
          <div id='ccChatBoxEnd' />
        </div>
      );
    }
  };
  
  const FriendList = props => {
    const {friends, friendisLoading, selectedFriend} = props;
    if (friendisLoading) {
      return (
        <div className='col-xl-12 my-auto text-center'>
          <MDSpinner size='72' />
        </div>
      );
    } else {
      return (
        <ul className='list-group list-group-flush w-100'>
          {friends.map(friend => (
            <li
              key={friend.uid}
              className={`list-group-item ${
                friend.uid === selectedFriend ? 'active' : ''
              }`}
              onClick={() => props.selectFriend(friend.uid)}>
              {friend.name}
            </li>
          ))}
        </ul>
      );
    }
  };
  