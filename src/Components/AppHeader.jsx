import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../AuthContext';
import URL from '../Config/Url';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppHeader = ({ active }) => {
  const [AddValue, setAddValue] = useState('');
  const { token } = useAuth();
  const [activeEmployee, setActiveEmployee] = useState('');

  useEffect(() => {
    fetchData();
  }, [active]);

  const fetchData = async () => {
    try {
      const employeeResponse = await axios.get(`${URL.apiUrl}getEmployeesByLastChoiceMedicalCenter`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = employeeResponse.data.data.employees;
      setInfo(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const setInfo = (data) => {
    let foundEmployee = '';
    data.forEach(element => {
      if (active === 'child-doctor' && element.type === 'child-doctor') {
        foundEmployee = element.id;
      } else if (active === 'women-doctor' && element.type === 'women-doctor') {
        foundEmployee = element.id;
      } else if (active === 'child-nutritionist' && element.type === 'child-nutritionist') {
        foundEmployee = element.id;
      } else if (active === 'women-nutritionist' && element.type === 'women-nutritionist') {
        foundEmployee = element.id;
      }
    });
    setActiveEmployee(foundEmployee);
    console.log('activeEmployee:', foundEmployee);
  };

  const handleSubmit = async () => {
    if(activeEmployee === ''){
      toast.warn('الموظف المطلوب غير موجود حالياً');
      return;
    }
    try {
      const response = await fetch(`${URL.apiUrl}createAppointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          medical_record_id: AddValue,
          employee_id: activeEmployee // Use activeEmployee here
        })
      });
      if (response.ok) {
        toast.success('تمت إضافة الموعد بنجاح.');
      } else {
        toast.error('حدث خطأ أثناء إضافة الموعد.');
        console.log(response)
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('خطأ غير معروف.');
    }
  };

  return (
    <div className="header--wrapper">
      <div className='header-div'>
        <div className={AddValue === '' ? 'non-active-search-box' : 'active-search-box'}>
          <FontAwesomeIcon icon={faPlus} className='header-icon' />
          <input
            onChange={(e) => setAddValue(e.target.value)}
            type="text"
            placeholder="إضافة موعد"
            value={AddValue}
          />
          <FontAwesomeIcon icon={faArrowLeft} className={AddValue === '' ? 'no' : 'arrow-icon'} onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
