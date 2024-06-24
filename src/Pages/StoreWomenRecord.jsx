import React, { useEffect, useState } from 'react';
import '../AddRecord.css';
import axios from 'axios';
import URL from '../Config/Url';
import { useAuth } from '../AuthContext';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useNavigate } from 'react-router-dom';


const StoreWomenRecord = () => {
    const [subdistricts, setSubdistricts] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [activeStep, setActiveStep] = useState(1);
    const navigate = useNavigate();

    const { token } = useAuth();

    const category = "pregnant";
    const [name, setName] = useState('');
    const [motherName, setMotherName] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [lastName, setLastName] = useState('');
    const gender='Female';
    const [specialNeeds, setSpecialNeeds] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [residenceStatus, setResidenceStatus] = useState('Resident');
    const [birthDate, setBirthDate] = useState('');
    const [relatedPerson, setRelatedPerson] = useState('');
    const [relatedPersonPhoneNumber, setRelatedPersonPhoneNumber] = useState('');
    const [governorateId, setGovernorateId] = useState('');
    const [districtId, setDistrictId] = useState('');
    const [subdistrictId, setSubdistrictId] = useState('');
    const [street, setStreet] = useState('');

    const setAddress = (subdistrictId) => {
        const selectedSubdistrict = subdistricts.find(subdistrict => subdistrict.id === parseInt(subdistrictId));
        if (selectedSubdistrict) {
            const selectedDistrict = districts.find(district => district.id === selectedSubdistrict.district_id);
            if (selectedDistrict) {
                setGovernorateId(selectedDistrict.governorate_id);
                setDistrictId(selectedDistrict.id);
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const subdistrictsResponse = await axios.get(`${URL.apiUrl}getSubdistrict`);
                setSubdistricts(subdistrictsResponse.data);
                const districtsResponse = await axios.get(`${URL.apiUrl}getDistrict`);
                setDistricts(districtsResponse.data);
            } catch (error) {
                toast.error('خطأ غير معروف')
            }
        };
        fetchData();
    });

    useEffect(() => {
        updateProgress();
    }, [activeStep]);

    const updateProgress = () => {
        const steps = document.querySelectorAll('.step');
        const form_steps = document.querySelectorAll('.form-step');

        steps.forEach((step, i) => {
            if (i === (activeStep - 1)) {
                step.classList.add('active');
                form_steps[i].classList.add('active');
            } else {
                step.classList.remove('active');
                form_steps[i].classList.remove('active');
            }
        });
    };

    const handleNext = () => {
        setActiveStep((prev) => (prev < 3 ? prev + 1 : prev));
    };

    const handlePrev = () => {
        setActiveStep((prev) => (prev > 1 ? prev - 1 : prev));
    };

    const handleSubmit = async () => {
        
        try {
            const response = await fetch(`${URL.apiUrl}storeRecord`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    category: category,
                    name: name,
                    mother_name: motherName,
                    father_name: fatherName,
                    last_name: lastName,
                    gender: gender,
                    phone_number: phoneNumber,
                    residence_status: residenceStatus,
                    special_needs: specialNeeds,
                    birth_date: birthDate,
                    related_person: relatedPerson,
                    related_person_phone_number: relatedPersonPhoneNumber,
                    address: {
                        governorate_id: governorateId,
                        district_id: districtId,
                        subdistrict_id: subdistrictId,
                        name: street,
                    }
                })
            });

            const jsonData = await response.json();
            console.log(jsonData);

            if(response.ok){
                toast.success('تمت إضافة السجل بنجاح')
                setTimeout(() => {
                    navigate('/Home'); 
                }, 3000); 
            }

            else if (!response.ok) {
                toast.error(jsonData.message);
                console.log(jsonData.data)
            }
        } catch (error) {
            toast.error('خطأ غير معروف');
        }
    };

    const handleSubdistrictChange = (e) => {
        const selectedSubdistrictId = e.target.value;
        setSubdistrictId(selectedSubdistrictId);
        setAddress(selectedSubdistrictId);
    };

    return (
        <div>
            <div className='add-Record' lang='ar' dir='rtl'>
            <div className='add-Record-body'>
                <div className="add-Record-container">
                    <div className="add-form-box">
                        <div className="add-progress">
                            <div className="add-logo"><a href="/"><span>إنشاء سجل حامل/مرضع</span></a></div>
                            <ul className="progress-steps">
                                <li className="step active">
                                    <span>1</span>
                                    <p>الملف<br /><span>البيانات الشخصية</span></p>
                                </li>
                                <li className="step">
                                    <span>2</span>
                                    <p>الاتصال<br /><span>تسجيل بيانات الهاتف والعنوان</span></p>
                                </li>
                                <li className="step">
                                    <span>3</span>
                                    <p>قريب<br /><span>تسجيل بيانات شخص قريب</span></p>
                                </li>
                            </ul>
                        </div>
                        <form>
                            <div className="form-one form-step active">
                                <h2>المعلومات الشخصية</h2>
                                <p>بعد أخذ بيانات المرأة قم بتسجيلها كما هي.</p>
                                <div>
                                    <label>الاسم</label>
                                    <input type="text" placeholder="الاسم الأول" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div>
                                    <label>الكنية</label>
                                    <input type="text" placeholder="الاسم الأخير" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                </div>
                                <div>
                                    <label>اسم الأب</label>
                                    <input type="text" placeholder="الاسم الأوسط" value={fatherName} onChange={(e) => setFatherName(e.target.value)} />
                                </div>
                                <div>
                                    <label>اسم الأم</label>
                                    <input type="text" placeholder="اسم والدة الطفل" value={motherName} onChange={(e) => setMotherName(e.target.value)} />
                                </div> 
                                <div>
                                    <label>تاريخ الولادة</label>
                                    <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                                </div>
                                <div className="checkbox">
                                    <input type="checkbox" checked={specialNeeds} onChange={(e) => setSpecialNeeds(e.target.checked)} />
                                    <label>احتياجات خاصة</label>
                                </div>
                            </div>
                            <div className="form-two form-step">
                                <h2>العنوان والهاتف</h2>
                                <p>قم بتسجيل بيانات الاتصال بدقة.</p>
                                <div>
                                    <label>حالة السكن</label>
                                    <select onChange={(e) => setResidenceStatus(e.target.value)}>
                                        <option value="Resident">مقيم</option>
                                        <option value="Immigrant">مهجر</option>
                                        <option value="Returnee">عائد</option>
                                    </select>
                                </div>
                                <div>
                                    <label>المنطقة الفرعية</label>
                                    <select value={subdistrictId} onChange={handleSubdistrictChange}>
                                        <option value="">الناحية</option>
                                        {subdistricts.map(subdistrict => (
                                            <option key={subdistrict.id} value={subdistrict.id}>{subdistrict.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label>الشارع</label>
                                    <input type='text' placeholder='الشارع' value={street} onChange={(e) => setStreet(e.target.value)} />
                                </div>
                                <div>
                                    <label>رقم الهاتف</label>
                                    <input dir='rtl' type='tel' placeholder='*** *** **9 0' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                                </div>
                            </div>
                            <div className="form-three form-step">
                                <h2>بيانات احتياطية</h2>
                                <p>قم بتسجيل بيانات شخص قريب من المرأة</p>
                                <div>
                                    <label>الاسم</label>
                                    <input type="text" placeholder="اسم" value={relatedPerson} onChange={(e) => setRelatedPerson(e.target.value)} />
                                </div>
                                <div>
                                    <label>رقم الهاتف</label>
                                    <input dir='rtl' type='tel' placeholder='*** *** **9 0' value={relatedPersonPhoneNumber} onChange={(e) => setRelatedPersonPhoneNumber(e.target.value)} />
                                </div>
                            </div>
                            <div className="btn-add-group">
                                <button type="button" className="btn-prev" onClick={handlePrev} disabled={activeStep === 1}>السابق</button>
                                <button type="button" className="btn-next" onClick={handleNext} disabled={activeStep === 3}>التالي</button>
                                <button type="button" className="btn-submit" onClick={handleSubmit}>تأكيد</button>
                            </div>
                        </form>
                    </div>
                </div>
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

export default StoreWomenRecord;
