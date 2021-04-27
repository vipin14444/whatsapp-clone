import styled from 'styled-components'
import Head from 'next/head'
import { Button } from '@material-ui/core'
import { auth, provider } from '../firebase'

const Login = () => {

    const signIn = () => {
        auth.signInWithPopup(provider).catch(alert)
    }

    return (
        <Container>
            <Head>
                <title>Login</title>
            </Head>

            <LoginContainer>
                <Logo src={'https://seeklogo.com/images/W/whatsapp-icon-logo-6E793ACECD-seeklogo.com.png'} />
                <Button onClick={signIn} variant="outlined">Sign in with Google</Button>
            </LoginContainer>
        </Container>
    )
}

const Container = styled.div`
    display: grid;
    place-items: center;
    background-color: whitesmoke;
    height: 100vh;
`;

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 3rem;
    background-color: white;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    box-shadow: 0px 0px 40px 0px #00000024;
`;

const Logo = styled.img`
    width: 30ch;
    margin-bottom: 2rem;
`;

export default Login
