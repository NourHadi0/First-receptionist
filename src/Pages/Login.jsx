import React, { useState, useEffect } from 'react';
import '../Login.css';
import LoginIntroWavePic from '../images/Login-intro-wave.png';
import LoginIntroOfficePic from '../images/Login-intro-doctors.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import URL from '../Config/Url';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login(){
    const { Login } = useAuth();
    const navigate = useNavigate();
   
    const [medicalCenters, setMedicalCenters] = useState([]);
    const [activities, setActivities] = useState([]);
    const [coverages, setCoverages] = useState([]);
    const [accesses, setAccesses] = useState([]);
    const [partners, setPartners] = useState([]);
    const [offices, setOffices] = useState([]);
    const [agencies, setAgencies] = useState([]);

    const [step, setStep] = useState(1);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [selectedPartner, setSelectedPartner] = useState('');
    const [selectedAgency, setSelectedAgency] = useState('');
    const [selectedOffice, setSelectedOffice] = useState('');
    const [selectedActivity, setSelectedActivity] = useState('');
    const [selectedMedicalCenter, setSelectedMedicalCenter] = useState('');
    const [selectedCoverage, setSelectedCoverage] = useState('');
    const [selectedAccess, setSelectedAccess] = useState('');

    const form2Right = step === 1 ? '550px' : step === 2 ? '40px' : '-550px';
    
    const handleNext = () => {
      if (step === 1) {
        if (!userName || !password) {
            toast.warn('الرجاء إدخال جميع البيانات لاستكمال تسجيل الدخول');
            return;
        }
    } else if (step === 2) {
        if (!selectedPartner || !selectedAgency || !selectedOffice) {
            toast.warn('الرجاء إدخال جميع البيانات لاستكمال تسجيل الدخول');
            return;
        }
    }
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      

        try {
          const response = await fetch(`${URL.apiUrl}login`, {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              user_name: userName,
              password: password,
              employee_choise: {
                  medical_center_id: parseInt(selectedMedicalCenter),
                  coverage_id: parseInt(selectedCoverage),
                  office_id: parseInt(selectedOffice),
                  activity_id: parseInt(selectedActivity),
                  agency_id: parseInt(selectedAgency),
                  access_id: parseInt(selectedAccess),
                  partner_id: parseInt(selectedPartner),
              }
            }),
        });
            const responseData = await response.json();
            console.log(responseData)
            console.log(responseData.data.role[0])
            console.log(responseData.status)

            if(responseData.status === true){
                if(responseData.status === true && responseData.data.role[0] !== 'receptionist'){
                console.log('first if', responseData.data.role[0])
                toast.error('هذا التطبيق مخصص لموظفي الاستقبال')
                setStep(1);
            }
            else{
              const token = responseData.data.token;
              const name = responseData.data.employee.user_name;
              Login(token, name);
              navigate('/');
          }
            }
          else{
            toast.error('فشل تسجيل الدخول');
          }

        } catch (error) {
            toast.error('خطأ غير معروف');
            toast.error('فشل تسجيل الدخول');
        }
    };

    useEffect(() => {
        const inputs = document.querySelectorAll(".input");

        function addFocus() {
            let parent = this.parentNode.parentNode;
            parent.classList.add("focus");
        }

        function removeFocus() {
            let parent = this.parentNode.parentNode;
            if (this.value === "") {
                parent.classList.remove("focus");
            }
        }

        inputs.forEach(input => {
            input.addEventListener("focus", addFocus);
            input.addEventListener("blur", removeFocus);
        });

        return () => {
            inputs.forEach(input => {
                input.removeEventListener("focus", addFocus);
                input.removeEventListener("blur", removeFocus);
            });
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const medicalCentersResponse = await axios.get(`${URL.apiUrl}getMedicalCenters`);
                setMedicalCenters(medicalCentersResponse.data.data);
                const activitiesResponse = await axios.get(`${URL.apiUrl}getActivities`);
                setActivities(activitiesResponse.data.data);
                const coveragesResponse = await axios.get(`${URL.apiUrl}getCoverages`);
                setCoverages(coveragesResponse.data.data);
                const accessesResponse = await axios.get(`${URL.apiUrl}getAccesses`);
                setAccesses(accessesResponse.data.data);
                const partnersResponse = await axios.get(`${URL.apiUrl}getPartners`);
                setPartners(partnersResponse.data.data);
                const officesResponse = await axios.get(`${URL.apiUrl}getOffices`);
                setOffices(officesResponse.data.data);
                const agenciesResponse = await axios.get(`${URL.apiUrl}getAgencies`);
                setAgencies(agenciesResponse.data.data);
            } catch (error) {
                toast.error('خطأ غير معروف');
            }
        };

        fetchData();
    }, []);

    return (
      <div dir='rtl' lang='ar' className='LoginBody'>
          <img src={LoginIntroWavePic} alt='Wave' className="wave" />
          <div className="login-container">
              <div className="login-img">
                  <img src={LoginIntroOfficePic} alt="login" />
              </div>
              <div className='multi-form-cotainer'>
                  <form id="Form1" style={{ left: step === 1 ? '50px' : '550px' }}>
                      <div className="login-content">
                          <div className='login-form'>
                              <h2 className="title">مرحباً بك</h2>
                              <div className="input-div one">
                                  <div className="login-i">
                                      <FontAwesomeIcon icon={faUser} className='login-icon' />
                                  </div>
                                  <div>
                                      <h6>اسم المستخدم</h6>
                                      <input 
                                          className="input" 
                                          type="text" 
                                          required
                                          value={userName}
                                          onChange={(e) => setUserName(e.target.value)}
                                      />
                                  </div>
                              </div>
                              <div className="input-div pass">
                                  <div className="login-i">
                                      <FontAwesomeIcon icon={faLock} className='login-icon' />
                                  </div>
                                  <div>
                                      <h6>كلمة المرور</h6>
                                      <input 
                                          className="input" 
                                          type="password" 
                                          required
                                          value={password}
                                          onChange={(e) => setPassword(e.target.value)}
                                      />
                                  </div>
                              </div>
                              <h4>في حال تغير ظروف العمل لاتنسَ إعادة تسجيل الدخول </h4>
                              <div className="login-form-btn-box">
                                  <button className="login-button" type="button" onClick={handleNext}>التالي</button>
                              </div>
                          </div>
                      </div>
                  </form>
                  <form id="Form2" style={{ right: form2Right }}>
                      <div className="login-content">
                          <div className='login-form'>
                              <h3>بيانات العمل لهذا اليوم</h3>
                              <div>
                                  <select className='login-select' required value={selectedPartner} onChange={(e) => setSelectedPartner(e.target.value)}>
                                      <option className="login-option" value="">الشريك</option>
                                      {partners.map(partner => (
                                          <option className="login-option" key={partner.id} value={partner.id}>{partner.name}</option>
                                      ))}
                                  </select>
                                  <select className='login-select' required value={selectedAgency} onChange={(e) => setSelectedAgency(e.target.value)}>
                                      <option className="login-option" value="">المنظمة</option>
                                      {agencies.map(agency => (
                                          <option className="login-option" key={agency.id} value={agency.id}>{agency.name}</option>
                                      ))}
                                  </select>
                                  <select className='login-select' required value={selectedOffice} onChange={(e) => setSelectedOffice(e.target.value)}>
                                      <option className="login-option" value="">المكتب</option>
                                      {offices.map(office => (
                                          <option className="login-option" key={office.id} value={office.id}>{office.name}</option>
                                      ))}
                                  </select>
                              </div>
                              <div className="login-form-btn-box">
                                  <button className="login-button" type="button" onClick={handleBack}>السابق</button>
                                  <button className="login-button" type="button" onClick={handleNext}>التالي</button>
                              </div>
                          </div>
                      </div>
                  </form>
                  <form id="Form3" style={{ right: step === 3 ? '40px' : '+550px' }} onSubmit={handleSubmit}>
                      <select className='login-select' required value={selectedActivity} onChange={(e) => setSelectedActivity(e.target.value)}>
                          <option className="login-option" value="">النشاط</option>
                          {activities.map(activity => (
                              <option className="login-option" key={activity.id} value={activity.id}>{activity.name}</option>
                          ))}
                      </select>
                      <select className='login-select' required value={selectedMedicalCenter} onChange={(e) => setSelectedMedicalCenter(e.target.value)}>
                          <option className="login-option" value="">المركز</option>
                          {medicalCenters.map(center => (
                              <option className="login-option" key={center.id} value={center.id}>{center.name}</option>
                          ))}
                      </select>
                      <select className='login-select' required value={selectedCoverage} onChange={(e) => setSelectedCoverage(e.target.value)}>
                          <option className="login-option" value="">مستوى التغطية</option>
                          {coverages.map(coverage => (
                              <option className="login-option" key={coverage.id} value={coverage.id}>{coverage.name}</option>
                          ))}
                      </select>
                      <select className='login-select' required value={selectedAccess} onChange={(e) => setSelectedAccess(e.target.value)}>
                          <option className="login-option" value="">الوصول</option>
                          {accesses.map(access => (
                              <option className="login-option" key={access.id} value={access.id}>{access.name}</option>
                          ))}
                      </select>
                      <div className="login-form-btn-box">
                          <button className="login-button" type="button" onClick={handleBack}>السابق</button>
                          <button className="login-button" onClick={() => handleSubmit} type="submit">تأكيد</button>
                      </div>
                  </form>
              </div>
          </div>
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
}

export default Login;