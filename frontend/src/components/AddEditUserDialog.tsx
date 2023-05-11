import { Button, Form, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { User } from "../models/user";
import TextInputField from "./form/TextInputField";
import * as UsersApi from "../network/users_api"
import { useState } from "react";
import styleButtons from "../styles/signUpButtons.module.css";

interface UserInput {
    username: string,
    email: string,
    password: string,
    role: string,
}

interface AddEditUserDialogProps {
    userToEdit?: User,
    onDismiss: () => void,
    onUserSaved: (user: User) => void,
    caller: string,
}

const AddEditUserDialog = ({userToEdit, onDismiss, onUserSaved, caller}: AddEditUserDialogProps) => {
    const { register, handleSubmit, formState : {errors, isSubmitting} } = useForm<UserInput>({
        defaultValues:{
            username: userToEdit?.username || "",
            email: userToEdit?.email || "",
            role: userToEdit?.role || "",
        }
    });
    
    const [selectedRole, setSelectedRole] = useState<string>(userToEdit ? userToEdit.role : "");

    const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedRole(e.target.value);
    };

    async function onSubmit(input: UserInput){
        try {
            input.role = selectedRole;

            let userResponse: User;
            if(userToEdit){
                userResponse = await UsersApi.updateUser(userToEdit._id, input);
            } else {
                userResponse = await UsersApi.createUser(input);
            }
            onUserSaved(userResponse);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {userToEdit ? "Edit user" : "Add user"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form id="addEditUserForm" onSubmit={handleSubmit(onSubmit)}>
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
                        type="text"
                        placeholder="Email"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.email}
                    />
                    {userToEdit ? "" :
                        <TextInputField
                            name="password"
                            label="Password"
                            type="password"
                            placeholder="Password"
                            register={register}
                            registerOptions={{ required: "Required" }}
                            error={errors.password}
                    />}

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
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    type="submit"
                    form="addEditUserForm"
                    disabled={isSubmitting}
                >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
 
export default AddEditUserDialog;