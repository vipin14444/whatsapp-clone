import styled from "styled-components"
import { auth, db } from "../firebase"
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Avatar, IconButton } from "@material-ui/core"
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import { useCollection } from "react-firebase-hooks/firestore"
import Message from "./Message"
import { useRef, useState } from "react"
import firebase from 'firebase'
import getRecipientEmail from "../utils/getRecipientEmail"
import TimeAgo from 'timeago-react'

const ChatScreen = ({ chat, messages }) => {

    const [user, loading] = useAuthState(auth)
    const router = useRouter()
    const [input, setInput] = useState('')
    const endOfMessagesRef = useRef(null)

    const [messageSnapshot] = useCollection(db.collection('chats').doc(router.query.id).collection('messages').orderBy('timestamp', 'asc'))
    const [recipientSnapshot] = useCollection(db.collection('users').where('email', '==', getRecipientEmail(chat.users, user)))

    const showMessages = () => {
        if (messageSnapshot) {
            return messageSnapshot.docs.map(message => (
                <Message
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime()
                    }}
                />
            ))
        } else {
            return JSON.parse(messages).map(message => (
                <Message
                    key={message.id}
                    user={message.user}
                    message={message}
                />
            ))
        }
    }

    const scrollToBottom = () => {
        endOfMessagesRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }

    const sendMessage = (e) => {
        e.preventDefault()

        db.collection('users').doc(user.uid).set({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true })

        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoUrl: user.photoURL
        })

        setInput('')
        scrollToBottom();
    }

    const recipient = recipientSnapshot?.docs?.[0]?.data()
    const recipientEmail = getRecipientEmail(chat.users, user)

    return (
        <Container>
            <Header>
                {
                    recipient ? (
                        <Avatar src={recipient?.photoURL} />
                    ) : (
                        <Avatar>{recipientEmail[0]}</Avatar>
                    )
                }
                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {
                        recipientSnapshot ? (
                            <p>Last active: {' '} {recipient?.lastSeen?.toDate() ? (<TimeAgo datetime={recipient?.lastSeen?.toDate()} />) : ('Unavailable')}</p>
                        ) : (<p>Loading last active...</p>)
                    }
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </HeaderIcons>
            </Header>

            <MessageContainer>
                {showMessages()}
                <EndOfMessages ref={endOfMessagesRef}/>
            </MessageContainer>

            <InputContainer>
                <IconButton>
                    <InsertEmoticonIcon />
                </IconButton>

                <InputWrapper>
                    <Input placeholder='Type a message' value={input} onChange={e => { setInput(e.target.value) }} />
                </InputWrapper>

                <button hidden disabled={!input} type='submit' onClick={sendMessage}>Send Message</button>

                <IconButton>
                    <MicIcon />
                </IconButton>
            </InputContainer>
        </Container>
    )
}

export default ChatScreen

const Container = styled.div``
const Header = styled.div`
    position: sticky;
    background-color: #ededed;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 1rem;
    align-items: center;
    height: 80px;
    border-bottom: 1px solid #dadada;
`

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;

    > h3 {
        margin: 0;
        margin-bottom: 3px;
        font-size: 1rem;
    }

    > p {
        font-size: 0.7rem;
        margin: 0;
        color: gray;
    }
`
const HeaderIcons = styled.div``

const MessageContainer = styled.div`
    padding: 1rem;
    background-color: #e5ddd5;
    min-height: 90vh;
`

const EndOfMessages = styled.div`
    margin-bottom: 52px;
`

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    position: sticky;
    bottom: 0;
    z-index: 100;
    background-color: #f0f0f0;
`

const InputWrapper = styled.div`
    background-color: white;
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 10rem;
    width: 100%;
    margin: 0 1rem;
    min-height: 40px;
`

const Input = styled.input`
    border: none;
    outline: none;
    width: 100%;
    background: none;
`