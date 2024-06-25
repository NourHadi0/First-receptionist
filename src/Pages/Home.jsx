import React, { useState, useEffect } from 'react';
import SideBar from '../Components/SideBar';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import '../Home.css';
import AppointmentsTable from '../Components/AppointmentsTable';
import PatientsSection from '../Components/PatientsSection';
import UserSection from '../Components/UserSection';

const Home = () => {
    const [selectedSection, setSelectedSection] = useState('قسم مواعيد اليوم');
    const [text, setText] = useState('جداول مواعيد اليوم');
    const { token, role, Logout } = useAuth();
    const navigate = useNavigate();

    const handleSectionSelect = (section) => {
        setSelectedSection(section);

        switch (section) {
            case 'قسم مواعيد اليوم':
                setText('جداول مواعيد اليوم');
                break;
            case 'قسم المرضى':
                setText('');
                break;
            case 'قسم حسابات المستخدمين':
                setText('');
                break;
            default:
                setText('');
        }
    };

    useEffect(() => {
        if (!token || role !== 'receptionist'){
            navigate('/Login');
        }
    }, [token, navigate]);

    return (
        <div lang='ar' dir='rtl' className='Home-body'>
            <SideBar selectedSection={selectedSection} onSelectSection={handleSectionSelect} />
            <div className="main--content">
                {selectedSection === 'قسم مواعيد اليوم' && <AppointmentsTable />}
                {selectedSection === 'قسم المرضى' && <PatientsSection />}
                {selectedSection === 'قسم حسابات المستخدمين' && <UserSection />}
            </div>
        </div>
    );
};

export default Home;
