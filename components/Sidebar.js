import { Avatar, IconButton, Button } from '@material-ui/core'
import styled from 'styled-components'
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import * as EmailValidator from 'email-validator'
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import Chat from './Chat';

const Sidebar = () => {

    const [user, loading] = useAuthState(auth)
    const userChatRef = db.collection('chats').where('users', 'array-contains', user.email)
    const [chatSnapshot] = useCollection(userChatRef)

    const createChat = () => {
        const input = prompt('Please enter an email of the user that you want to chat with.')

        if (!input) return;

        if (EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email) {

            // add the chat record to db if it doesnt exist before and is valid

            db.collection('chats').add({
                users: [user.email, input]
            })
        }
    }

    const chatAlreadyExists = (recipientEmail) => {
        return !!chatSnapshot?.docs.find(chat => chat.data().users.find(user => user === recipientEmail)?.length > 0)
    }

    return (
        <Container>
            <Header>
                <UserAvatar src={user.photoURL} onClick={() => { auth.signOut() }} />
                <IconsContainer>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </IconsContainer>
            </Header>

            <SearchContainer>
                <SearchWrapper>
                    <SearchIcon />
                    <SearchInput placeholder='Search in chats' />
                </SearchWrapper>
            </SearchContainer>

            <NewChatButton onClick={createChat}>Start New Chat</NewChatButton>

            {/* List of chats here */}

            {
                chatSnapshot?.docs.map(chat => (
                    <Chat key={chat.id} id={chat.id} users={chat.data().users} />
                ))
            }
        </Container>
    )
}

const Container = styled.div`
    flex: 0.45;
    border-right: 1px solid #dadada;
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y: scroll;

    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #ededed;
    position: sticky;
    top: 0;
    z-index:1;
    padding: 1rem;
    border-bottom: 1px solid #dadada;
    height: 80px;
`

const UserAvatar = styled(Avatar)`
    cursor: pointer;

    :hover {
        opacity: 0.8;
    }
`

const IconsContainer = styled.div``

const SearchContainer = styled.div`
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    background-color: #f6f6f6;
`

const SearchWrapper = styled.div`
    background-color: white;
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 10rem;
    width:100%;
`

const SearchInput = styled.input`
    border: none;
    outline: none;
    width: 100%;
    margin-left: 1rem;
`

const NewChatButton = styled(Button)`
    width: 100%;
    &&& {
        border-top: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
    }
`

export default Sidebar
