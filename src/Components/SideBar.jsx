import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable } from '@fortawesome/free-solid-svg-icons';
import { faHospitalUser } from '@fortawesome/free-solid-svg-icons';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../AuthContext';
import '../Home.css'
import { useNavigate } from 'react-router-dom';

const SideBar = ({ selectedSection, onSelectSection }) => {
    const { Logout } = useAuth();
    const navigate = useNavigate();

    const LogoutIssues = () => {
        Logout();
        navigate()
    }

  return (
    <div className='Sidebar'>
        <div className="logo">UB</div>
        <ul className="menu">
            <div onClick={() => onSelectSection('قسم مواعيد اليوم')}>
                <li className={selectedSection === 'قسم مواعيد اليوم' ? 'active' : ''}>
                    <div className='a-div'>
                        <FontAwesomeIcon icon={faTable} className='sidebar-icon' />
                        <span>مواعيد اليوم</span>
                    </div>
                </li>
            </div>
            <div onClick={() => onSelectSection('قسم المرضى')}>
                <li className={selectedSection === 'قسم المرضى' ? 'active' : ''}>
                    <div className='a-div'>
                        <FontAwesomeIcon icon={faHospitalUser} className='sidebar-icon' />
                        <span>إدارة المرضى</span>
                    </div>
                </li>
            </div>
            <div onClick={() => onSelectSection('قسم حسابات المستخدمين')}>
                <li className={selectedSection === 'قسم حسابات المستخدمين' ? 'active' : ''}>
                    <div className='a-div' >
                        <FontAwesomeIcon icon={faCircleUser} className='sidebar-icon' />
                        <span>إدارة الحسابات</span>
                    </div>
                </li>
            </div>
            <div>
                <li className="logout">
                    <div className='a-div' onClick={() => LogoutIssues()}>
                        <FontAwesomeIcon icon={faSignOutAlt} className='sidebar-icon' />
                        <span>تسجيل الخروج</span>
                    </div>
                </li>
            </div>
        </ul>
    </div>
  )
}

export default SideBar