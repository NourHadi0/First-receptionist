import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import URL from '../Config/Url';
import { toast } from 'react-toastify';

const PatientRecord = ({ patientData, id, updatePatientData }) => {
    const [editMode, setEditMode] = useState(false);
    const { token } = useAuth();
    const [newPhoneNumber, setNewPhoneNumber] = useState('');
    const [newStreet, setNewStreet] = useState('');
    const [newResidenceStatus, setNewResidenceStatus] = useState('');
    const [newRelatedPersonPhoneNumber, setNewRelatedPersonPhoneNumber] = useState('');

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleSaveClick = () => {
        const updatedPhoneNumber = newPhoneNumber || patientData[0].phone_number;
        const updatedStreet = newStreet || patientData[0].street;
        const updatedResidenceStatus = newResidenceStatus || patientData[0].residence_status;
        const updatedRelatedPersonPhoneNumber = newRelatedPersonPhoneNumber || patientData[0].related_person_phone_number;

        save(updatedPhoneNumber, updatedStreet, updatedResidenceStatus, updatedRelatedPersonPhoneNumber);
        setEditMode(false);
    };

    const save = async (phoneNumber, street, residenceStatus, relatedPersonPhoneNumber) => {
        try {
            const formattedPhoneNumber = relatedPersonPhoneNumber.toString();

            const response = await fetch(`${URL.apiUrl}update/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    phone_number: phoneNumber,
                    residence_status: residenceStatus,
                    related_person_phone_number: formattedPhoneNumber,
                    address: {
                        name: street
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

            // Update the parent state with the new data
            updatePatientData([result.data]);

        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <div className='record'>
            <h2>بيانات المريض</h2>
            <p>رقم السجل: {patientData[0].id}</p>
            <p>الاسم الكامل: {patientData[0].full_name}</p>
            <p>اسم الأم: {patientData[0].mother_name}</p>
            <p>العمر: {patientData[0].age}</p>
            <p>الجنس: {patientData[0].gender}</p>
            <p>الفئة: {patientData[0].category}</p>
            <h2>بيانات الاتصال</h2>
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
                    patientData[0].phone_number
                )}
            </p>
            <div>
            {patientData[0].account_id ? (
            <p>
            رقم الحساب:
            {patientData[0].account_id}
            </p>) : (<p>السجل غير متصل بحساب</p>)
}
            </div>
            <h2>بيانات السكن</h2>
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
                    patientData[0].address_name
                )}
            </p>
            <p>
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
                    patientData[0].residence_status
                )}
            </p>
            <h2>بيانات شخص قريب</h2>
            <p>
                الاسم:
                {patientData[0].related_person}
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
                    patientData[0].related_person_phone_number
                )}
            </p>
            {editMode ? (
                <button className='record-button' onClick={handleSaveClick}>حفظ البيانات</button>
            ) : (
                <button className='record-button' onClick={handleEditClick}>تعديل السجل</button>
            )}
        </div>
    );
};

export default PatientRecord;
