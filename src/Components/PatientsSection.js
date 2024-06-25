import React, { useState, useEffect } from 'react';
import Header from './Header';
import URL from '../Config/Url';
import { useAuth } from '../AuthContext';
import PatientRecord from './PatientRecord';
import search from '../images/search.svg';
import Loading from './Loading';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PatientsSection = () => {
    const [patientData, setPatientData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    const handleSearch = async (searchValue) => {
        if (searchValue) {
            setLoading(true);
            try {
                const response = await fetch(`${URL.apiUrl}search`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ input: searchValue })
                });
                const data = await response.json();
                if (data.status) {
                    setPatientData(data.data);
                    console.log('Patient data:', data.data);
                } else {
                    setPatientData(null);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setPatientData(null);
                toast.error('فشل إحضار البيانات')
            } finally {
                setLoading(false);
            }
        } else {
            setPatientData(null);
        }
    };

    const updatePatientData = (updatedData) => {
        setPatientData(updatedData);
    };

    useEffect(() => {
        if (patientData) {
            console.log('Patient data updated:', patientData);
            const addressName = patientData[0]?.addresses?.[0]?.name;
            if (addressName !== undefined) {
                console.log('Address name:', addressName);
            } else {
                console.log('Address name is undefined');
            }
        }
    }, [patientData]);

    return (
        <div>
            <Header search='patients' onSearch={handleSearch} />
            {loading ? (
                <div className="loading-container"><Loading /></div>
            ) : patientData ? (
                <PatientRecord patientData={patientData} id={patientData[0].id} age={patientData[0].age} updatePatientData={updatePatientData} />
            ) : (
                <div className='centered'>
                    <img src={search} alt='search' />
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

export default PatientsSection;
