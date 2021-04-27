import styled from 'styled-components';
import { Circle } from 'better-react-spinkit'

const Loading = () => {
    return (
        <Container>
            <Wrapper>
                <Logo src={'https://seeklogo.com/images/W/whatsapp-icon-logo-6E793ACECD-seeklogo.com.png'} />
                <Circle color={'#4caf50'} size={40} />
            </Wrapper>
        </Container>
    )
}

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
`
const Wrapper = styled.div`
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`

const Logo = styled.img`
    width: 20ch;
    margin-bottom: 2rem;
`;

export default Loading
