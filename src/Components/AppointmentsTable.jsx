import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Loading from './Loading';
import AppHeader from './AppHeader';
import SmallLoading from './SmallLoading';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../AuthContext';
import URL from '../Config/Url';

const AppointmentsTable = () => {
    const [active, setActive] = useState('child-doctor');
    const [appointmentsData, setAppointmentsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { token } = useAuth();
    const [isSmallLoading, setIsSmallLoading] = useState(null);
    const [isError, setIsError] = useState(false);

    const handleTrash = async (id) => {
        setIsSmallLoading(id);
        try {
            const response = await fetch(`${URL.apiUrl}deleteAppointment/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                toast.error('حدث خطأ أثناء حذف الموعد.');
            } else {
                setAppointmentsData((prevData) => prevData.filter((appointment) => appointment.id !== id));
                toast.success('تم حذف الموعد بنجاح.');
            }
        } catch (error) {
            toast.error('حدث خطأ أثناء حذف الموعد.');
        }
        setIsSmallLoading(null);
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${URL.apiUrl}showAppointment`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const jsonData = await response.json();
            if (jsonData && jsonData.data) {
                setAppointmentsData(jsonData.data);
                setIsLoading(false);
            } else {
                setIsError(true);
                setIsLoading(false);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error('غير مصرح لك. يرجى تسجيل الدخول مرة أخرى.');
            } else {
                toast.error('حدث خطأ في جلب البيانات.');
            }
            setIsError(true);
            setIsLoading(false);
        }
    };

    const addNewAppointment = async (medicalRecordId, employeeId) => {
        try {
            const response = await fetch(`${URL.apiUrl}createAppointment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    medical_record_id: medicalRecordId,
                    employee_id: employeeId
                })
            });
            if (response.ok) {
                toast.success('تمت إضافة الموعد بنجاح.');
                fetchData();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Error creating appointment:', error);
            toast.error('خطأ غير معروف.');
        }
    };

    useEffect(() => {
        fetchData();
    }, [active]);

    const filteredAppointments = appointmentsData.filter(item => {
        if (active === 'child-doctor') {
            return item.employee_type === "Doctor" && item.medical_record.category === "child";
        } else if (active === 'women-doctor') {
            return item.employee_type === "Doctor" && item.medical_record.category === "pregnant";
        } else if (active === 'child-nutritionist') {
            return item.employee_type === "Nutritionist" && item.medical_record.category === "child";
        } else if (active === 'women-nutritionist') {
            return item.employee_type === "Nutritionist" && item.medical_record.category === "pregnant";
        }
        return true;
    });

    const formatTime = (timeString) => {
        if (!timeString) return '';
        const date = new Date(timeString);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const period = hours < 12 ? 'صباحاً' : 'ظهراً';
        const formattedHours = hours % 12 || 12; // Adjust hours to 12-hour format
        const formattedMinutes = minutes.toString().padStart(2, '0');
        return `${formattedHours}:${formattedMinutes} ${period}`;
    };

    return (
        <div>
            <AppHeader active={active} onAddAppointment={addNewAppointment} />
            {isLoading ? (
                <div className="loading-container"><Loading /></div>
            ) : isError ? (
                <div className='centered'>خطأ في تحميل البيانات، حاول مجدداً</div>
            ) : (
                <div>
                    <div className='btns-div'>
                        <div className={active === 'child-doctor' ? 'active-btn' : 'btn'} onClick={() => setActive('child-doctor')}>طبيب الأطفال</div>
                        <div className={active === 'women-doctor' ? 'active-btn' : 'btn'} onClick={() => setActive('women-doctor')}>طبيبة النسائية</div>
                        <div className={active === 'child-nutritionist' ? 'active-btn' : 'btn'} onClick={() => setActive('child-nutritionist')}>التغذية أطفال</div>
                        <div className={active === 'women-nutritionist' ? 'active-btn' : 'btn'} onClick={() => setActive('women-nutritionist')}>التغذية نساء</div>
                    </div>
                    <div className='table-section'>
                        <table>
                            <thead>
                                <tr>
                                    <th>الترتيب</th>
                                    <th>الرقم</th>
                                    <th>الاسم</th>
                                    <th>التوقيت</th>
                                    <th>الإجراء</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAppointments.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{item.medical_record_id}</td>
                                        <td>{item.fullName}</td>
                                        <td>{formatTime(item.created_at)}</td>
                                        <td>
                                            {isSmallLoading === item.id ? (
                                                <SmallLoading />
                                            ) : (
                                                <FontAwesomeIcon className='trash' icon={faTrashCan} onClick={() => handleTrash(item.id)} />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            <ToastContainer
                position="top-left"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={true}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default AppointmentsTable;
