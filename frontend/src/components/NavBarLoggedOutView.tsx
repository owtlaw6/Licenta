import { Button } from "react-bootstrap";

interface NavBarLoggedOutViewProps {
    onSignUpClicked: () => void,
    onLoginClicked: () => void,
}

const NavBarLoggedOutView = ({ onSignUpClicked, onLoginClicked }: NavBarLoggedOutViewProps) => {
    return (
        <>
            <Button onClick={onSignUpClicked}>Request Account</Button>
            <Button onClick={onLoginClicked}>Log In</Button>
        </>
    );
}

export default NavBarLoggedOutView;