import styled from "styled-components"
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from "../firebase";
import moment from "moment";

const Message = ({ user, message }) => {

    const [userLoggedIn] = useAuthState(auth)

    const TypeOfMessage = user === userLoggedIn.email ? Sender : Receiver;

    return (
        <Container>
            <TypeOfMessage>
                {message.message}
                <Timestamp>{message.timestamp ? moment(message.timestamp).format('LT') : '...'}</Timestamp>
            </TypeOfMessage>
        </Container>
    )
}

export default Message

const Container = styled.div``

const MessageElement = styled.p`
    width: fit-content;
    padding: 0.5rem;
    border-radius: 0.5rem;
    margin: 0.7rem;
    min-width: 60px;
    position: relative;
    text-align: right;
    font-size: 0.9rem;
    color: #303030;
    padding-bottom: 1rem;
`

const Sender = styled(MessageElement)`
    margin-left: auto;
    background-color: #dcf8c6;
`

const Receiver = styled(MessageElement)`
    background-color: #fff;
    text-align: left;
`

const Timestamp = styled.span`
    color: rgba(0,0,0,0.45);
    font-size: 0.55rem;
    position: absolute;
    bottom: 0;
    right: 0;
    text-align: right;
    padding: 0.3rem 0.5rem;
`