import { Menu } from 'antd';
import React, { useState } from 'react';
import { BiUser } from 'react-icons/bi';
import { SlWallet } from "react-icons/sl";
import { useNavigate } from 'react-router-dom';
const SettingSidebar = ({ index }) => {
    const [selectedKey, setSelectedKey] = useState(index);
    const navigate = useNavigate();
    const items = [
        {
            key: 'account-details',
            label: (
                <span
                    className={`${selectedKey === 'account-details' ? 'text-gray-500' : 'text-black'
                        } font-nike`}
                >
                    Account Details
                </span>
            ),
            icon: <BiUser />,
        },
        {
            key: 'wallet',
            label: (
                <span
                    className={`${selectedKey === 'wallet' ? 'text-gray-500' : 'text-black'
                        } font-nike`}
                >
                    Wallet
                </span>
            ),
            icon: <SlWallet />,
        },
    ];
    const handleSelect = ({ key }) => {
        setSelectedKey(key);
        if(key === 'account-details') {
            navigate('/account-setting');
        }
        if(key === 'wallet') {
            navigate('/user-wallet');
        }
    };
    return (
        <div className="mt-20 ml-20">
            <div className="font-nike text-2xl">
                <h3>Settings</h3>
            </div>
            <div>
                <Menu
                    mode="vertical"
                    selectedKeys={[selectedKey]}
                    onClick={handleSelect}
                    className="space-y-2"
                >
                    {items.map((item) => (
                        <Menu.Item
                            key={item.key}
                            className={`${selectedKey === item.key
                                ? 'bg-gray-100 text-gray-500'
                                : 'bg-transparent text-black'
                                } hover:bg-gray-200`}
                            icon={item.icon}
                        >
                            {item.label}
                        </Menu.Item>
                    ))}
                </Menu>
            </div>
        </div>
    );
};

export default SettingSidebar;