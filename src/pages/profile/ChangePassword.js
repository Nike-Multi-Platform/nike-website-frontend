import React, { useReducer } from 'react';
import SettingSidebar from '../../components/profile/SettingSidebar';
import { Button, Form, Input, message } from 'antd';
import { changePassword } from '../../services/userService';
import { useSelector } from 'react-redux';

const ChangePassword = () => {
    const [localState, setLocalState] = useReducer(
        (state, action) => {
            return { ...state, [action.type]: action.payload };
        },
        {
            current_password: '',
            new_password: '',
            confirm_password: '',
            error: {
                current_password: null,
                new_password: null,
                confirm_password: null
            },
            loading: false,
            disable: true
        }
    );
    const user = useSelector((state) => state.user);

    const handleOnChange = (name, value) => {
        setLocalState({
            type: name,
            payload: value
        });
        const errors = validate({ ...localState, [name]: value });
        setLocalState({
            type: 'error',
            payload: errors
        });
        const hasErrors = Object.values(errors).some((err) => err !== null);
        setLocalState({
            type: 'disable',
            payload: hasErrors
        });
    };


    // Validate form values
    const validate = (state) => {
        const errors = { ...state.error };
        // current password validation
        if (!state.current_password) {
            errors.current_password = 'Current password is required';
        } else {
            errors.current_password = null;
        }

        // new password validation
        if (!state.new_password) {
            errors.new_password = 'New password is required';
        } else if (state.new_password.length < 6) {
            errors.new_password = 'Password must be at least 6 characters';
        } else if (state.new_password === state.current_password) {
            errors.new_password = 'New password must be different from current password';
        } else {
            errors.new_password = null;
        }

        // confirm password validation
        if (!state.confirm_password) {
            errors.confirm_password = 'Confirm password is required';
        } else if (state.confirm_password !== state.new_password) {
            errors.confirm_password = 'Password does not match';
        } else {
            errors.confirm_password = null;
        }

        return errors;
    };

    const handleSubmit = async () => {
        setLocalState({
            type: 'loading',
            payload: true
        });
        const payload = {
            UserID: user.userId,
            CurrentPassword: localState.current_password,
            NewPassword: localState.new_password
        };
        const response = await changePassword(payload);
        if (response?.statusCode === 200) {
            message.success(response.message);
            setLocalState({
                type: 'loading',
                payload: false
            });
        } else {
            message.error(response.message);
            setLocalState({
                type: 'loading',
                payload: false
            });
        }
    }

    return (
        <div className="flex flex-row max-w-[1400px] mx-auto">
            <div className="w-1/4">
                <SettingSidebar index={'change-password'} />
            </div>
            <div className="w-3/4 mt-10 ml-10">
                <div>
                    <h1 className="text-2xl font-nike">Change Password</h1>
                    <Form layout="vertical" className="mt-4 w-2/4" loading={localState.loading}>
                        <Form.Item
                            name="current_password"
                            label="Current Password"
                            help={localState.error.current_password}
                            validateStatus={localState.error.current_password ? 'error' : ''}
                        >
                            <Input
                                type="password"
                                value={localState.current_password}
                                onChange={(e) => handleOnChange('current_password', e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item
                            name="new_password"
                            label="New Password"
                            help={localState.error.new_password}
                            validateStatus={localState.error.new_password ? 'error' : ''}
                        >
                            <Input
                                type="password"
                                value={localState.new_password}
                                onChange={(e) => handleOnChange('new_password', e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item
                            name="confirm_password"
                            label="Confirm Password"
                            help={localState.error.confirm_password}
                            validateStatus={localState.error.confirm_password ? 'error' : ''}
                        >
                            <Input
                                type="password"
                                value={localState.confirm_password}
                                onChange={(e) => handleOnChange('confirm_password', e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                className={`bg-black text-white font-nikeBody ${localState.disable ? ' bg-gray-500' : ''}`}
                                disabled={localState.disable}
                                loading={localState.loading}
                                onClick={() => handleSubmit()}
                            >
                                Save
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
