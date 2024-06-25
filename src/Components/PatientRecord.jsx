import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import URL from '../Config/Url';

const PatientRecord = ({ patientData, id, updatePatientData, age }) => {
    const [editMode, setEditMode] = useState(false);
    const { token } = useAuth();
    const patient = patientData[0] || {};
    const [newPhoneNumber, setNewPhoneNumber] = useState(patient.phone_number || '');
    const [newStreet, setNewStreet] = useState((patient.addresses && patient.addresses[0] && patient.addresses[0].name) || '');
    const [newResidenceStatus, setNewResidenceStatus] = useState(patient.residence_status || '');
    const [newRelatedPersonPhoneNumber, setNewRelatedPersonPhoneNumber] = useState(patient.related_person_phone_number || '');

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleSaveClick = () => {
        const updatedPhoneNumber = newPhoneNumber || patient.phone_number;
        const updatedStreet = newStreet || (patient.addresses && patient.addresses[0] && patient.addresses[0].name);
        const updatedResidenceStatus = newResidenceStatus || patient.residence_status;
        const updatedRelatedPersonPhoneNumber = newRelatedPersonPhoneNumber || patient.related_person_phone_number;

        console.log('updatedStreet', updatedStreet);
        save(updatedPhoneNumber, updatedStreet, updatedResidenceStatus, updatedRelatedPersonPhoneNumber);
        setEditMode(false);
    };

    const save = async (phoneNumber, updatedStreet, residenceStatus, relatedPersonPhoneNumber) => {
        try {
            const formattedRelatedPersonPhoneNumber = relatedPersonPhoneNumber.toString();
            const formattedPhoneNumber = phoneNumber.toString();

            console.log('updatedStreet', updatedStreet);

            const response = await fetch(`${URL.apiUrl}update/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    phone_number: formattedPhoneNumber,
                    residence_status: residenceStatus,
                    related_person_phone_number: formattedRelatedPersonPhoneNumber,
                    addresses: {
                        name: updatedStreet
                    }
                })
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                console.error('Error details:', errorDetails);
                return;
            }

            const result = await response.json();
            console.log(result);

            updatePatientData([result.data]);
            console.log('Updated data', [result.data]);

        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <div className='record'>
            <div className='container'>
                <div className='record-container'>
                    <h2>بطاقة البيانات الشخصية</h2>
                    <div className='br'></div>
                    <p>رقم السجل: {patient.id}</p>
                    <p>الاسم: {patient.name}</p>
                    <p>الكنية: {patient.last_name}</p>
                    <p>اسم الأب: {patient.father_name}</p>
                    <p>اسم الأم: {patient.mother_name}</p>
                    <p>المواليد: {patient.birth_date}</p>
                    <>
                        {patient.gender === 'Female' ? (
                        <p>
                            الجنس : أنثى
                        </p>) : (
                            <p>
                                الجنس : ذكر
                            </p>
                        )}
                    </>
                    <>
                        {patient.category === 'child' ? (
                        <p>
                            الفئة : فئة الأطفال
                        </p>) : (
                            <p>
                                الفئة : فئة الحوامل والمرضعات
                            </p>
                        )}
                    </>
                </div>
                
                <div className='second-column'>
                    <div className='record-container'>
                        <h2>بيانات الاتصال والسكن</h2>
                        <div className='br'></div>
                        <p>
                            الرقم:
                            {editMode ? (
                                <input
                                    type="text"
                                    name="phone_number"
                                    value={newPhoneNumber}
                                    onChange={(e) => setNewPhoneNumber(e.target.value)}
                                />
                            ) : (
                                patient.phone_number
                            )}
                        </p>
                        <>
                            {patient.account_id ? (
                                <p>
                                    رقم الحساب:
                                    {patient.account_id}
                                </p>
                            ) : (
                                <p>السجل غير متصل بحساب</p>
                            )}
                        </>
                        <p>
                            العنوان:
                            {editMode ? (
                                <input
                                    type="text"
                                    name="address_name"
                                    value={newStreet}
                                    onChange={(e) => setNewStreet(e.target.value)}
                                />
                            ) : (
                                patient.addresses && patient.addresses[0] && patient.addresses[0].name
                            )}
                        </p>
                        الحالة السكنية:
                        {editMode ? (
                            <select
                                name="residence_status"
                                value={newResidenceStatus}
                                onChange={(e) => setNewResidenceStatus(e.target.value)}
                            >
                                <option value="Resident">مقيم</option>
                                <option value="Immigrant">مهجر</option>
                                <option value="Returnee">عائد</option>
                            </select>
                        ) : (
                            patient.residence_status === "Resident" ? (
                                <p>مقيم</p>
                            ) : patient.residence_status === "Immigrant" ? (
                                <p>مهجَّر</p>
                            ) : patient.residence_status === "Returnee" ? (
                                <p>عائد</p>
                            ) : (
                                <p>غير مسجَّل</p>
                            )
                        )}
                    </div>

                    <div className='record-container'>
                        <h2>بيانات شخص قريب</h2>
                        <div className='br'></div>
                        <p>
                            الاسم:
                            {patient.related_person}
                        </p>
                        <p>
                            الرقم:
                            {editMode ? (
                                <input
                                    type="text"
                                    name="related_person_phone_number"
                                    value={newRelatedPersonPhoneNumber}
                                    onChange={(e) => setNewRelatedPersonPhoneNumber(e.target.value)}
                                />
                            ) : (
                                patient.related_person_phone_number
                            )}
                        </p>
                    </div>
                </div>
            </div>
            <div className='floating-container-record'>
                {editMode ? (
                    <button className='record-button' onClick={handleSaveClick}>حفظ البيانات</button>
                ) : (
                    <button className='record-button' onClick={handleEditClick}>تعديل السجل</button>
                )}
            </div>
        </div>
    );
};

export default PatientRecord;
