import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { SignUpCredentials } from "../network/notes_api";
import * as NotesApi from "../network/notes_api";
import { Alert, Button, Form, Modal, Row } from "react-bootstrap";
import TextInputField from "./form/TextInputField";
import styleUtils from "../styles/utils.module.css";
import styleButtons from "../styles/signUpButtons.module.css";
import { useState } from 'react';
import { ConflictError } from "../errors/http_errors";

interface SignUpModalProps {
    onDismiss: () => void,
    onSignUpSuccessful: (user: User) => void,
}

const SignUpModal = ({ onDismiss, onSignUpSuccessful }: SignUpModalProps) => {

    const [errorText, setErrorText] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<string>("");

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpCredentials>();

    async function onSubmit(credentials: SignUpCredentials) {
        try {
            credentials.role = selectedRole;

            const newUser = await NotesApi.signUp(credentials);
            onSignUpSuccessful(newUser);
        } catch (error) {
            if (error instanceof ConflictError) {
                setErrorText(error.message);
            } else {
                alert(error);
            }
            console.error(error);
        }
    }

    const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedRole(e.target.value);
    };

    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Request Account
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {errorText &&
                    <Alert variant="danger">
                        {errorText}
                    </Alert>
                }
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name="username"
                        label="Username"
                        type="text"
                        placeholder="Username"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.username}
                    />
                    <TextInputField
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="Email"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.email}
                    />
                    <TextInputField
                        name="password"
                        label="Password"
                        type="password"
                        placeholder="Password"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.password}
                    />

                    <Row xs={1} md={2} xl={4} className={`g-4 ${styleButtons.buttonsGrid}`}>
                        <div>
                            <input
                                type="radio"
                                id="doctor"
                                value="Doctor"
                                name="role"
                                checked={selectedRole === "Doctor"}
                                onChange={handleRoleChange}
                            />
                            <label htmlFor="doctor">Doctor</label>
                        </div>

                        <div>
                        <input
                            type="radio"
                            id="assistant"
                            value="Assistant"
                            name="role"
                            checked={selectedRole === "Assistant"}
                            onChange={handleRoleChange}
                        />
                        <label htmlFor="assistant">Assistant</label>
                        </div>
                        
                        <div>
                        <input
                            type="radio"
                            id="technician"
                            value="Technician"
                            name="role"
                            checked={selectedRole === "Technician"}
                            onChange={handleRoleChange}
                        />
                        <label htmlFor="technician">Technician</label>
                        </div>
                        <div>
                        <input
                            type="radio"
                            id="admin"
                            value="Admin"
                            name="role"
                            checked={selectedRole === "Admin"}
                            onChange={handleRoleChange}
                        />
                        <label htmlFor="admin">Admin</label>
                        </div>
                    </Row>

                    
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={styleUtils.width100}>
                        Request Account
                    </Button>
                </Form>
            </Modal.Body>

        </Modal>
    );
}

export default SignUpModal;