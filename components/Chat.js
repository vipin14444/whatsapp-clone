import { Avatar } from "@material-ui/core"
import styled from "styled-components"
import getRecipientEmail from "../utils/getRecipientEmail"
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from "../firebase"
import { useCollection } from "react-firebase-hooks/firestore"
import { useRouter } from 'next/router'

const Chat = ({ id, users }) => {

    const router = useRouter()
    const [user, loading] = useAuthState(auth)
    const [recipientSnapshot] = useCollection(db.collection('users').where('email', '==', getRecipientEmail(users, user)))
    const recipient = recipientSnapshot?.docs?.[0]?.data()
    const recipientEmail = getRecipientEmail(users, user)

    const enterChat = () => {
        router.push(`/chat/${id}`)
    }

    return (
        <Container onClick={enterChat}>
            {
                recipient ? (
                    <UserAvatar src={recipient?.photoURL} />
                ) : (
                    <UserAvatar>{recipientEmail[0]}</UserAvatar>
                )
            }
            <p>{recipientEmail}</p>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0.5rem 1rem;
    word-break: break-word;

    :hover {
        background-color: #f5f5f5;
    }
`

const UserAvatar = styled(Avatar)`
    margin-right: 1rem;
`

export default Chat
