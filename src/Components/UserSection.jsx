import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import URL from '../Config/Url';
import '../toast.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserSection = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('Patient');
  const { token } = useAuth();
  const [content, setContent] = useState('add');
  const [accountId, setAccountId] = useState('');
  const [recordId, setRecordId] = useState(''); 

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${URL.apiUrl}createAccount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          password: password,
          user_name: userName,
          type: type
        })
      });

      const data = await response.json();
      if (response.ok) {
        setPassword('');
        setUserName('');
        setContent('link')
        toast.success('تم إنشاء الحساب بنجاح.');
      } else {
        const errorMsg = data.message || 'فشل في إنشاء الحساب.';
        toast.error(errorMsg);
      }
    } catch (error) {
      toast.error('فشل في إنشاء الحساب.');
    }
  };

  const handleSubmitlink = async () => {
    try {
      const response = await fetch(`${URL.apiUrl}linkAccountToRecord`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          medical_record_id: recordId,
          account_id: accountId
        })
      });

      const data = await response.json();
      if (response.ok) {
        setAccountId('');
        setRecordId('');
        setContent('add');
        toast.success('تم ربط الحساب بنجاح.');
      } else {
        const errorMsg = data.message || 'فشل في ربط الحساب.';
        toast.error(errorMsg);
      }
    } catch (error) {
      toast.error('فشل في ربط الحساب.');
    }
  };

  return (
    <div>
      <div className="header--wrapper">
        <div className='header-div'>
          <div className={content === 'add' ? 'activated' : 'header-button'} onClick={() => setContent('add')}>
            <FontAwesomeIcon icon={faPlus} className='header-icon' />
            <p>إضافة</p>
          </div>
          <div className={content === 'link' ? 'activated' : 'header-button'}  onClick={() => setContent('link')}>
            <FontAwesomeIcon icon={faLink} className='header-icon'  />
            <p>ربط</p>
          </div>
        </div>
      </div>
      {content === 'add' ? (
        <div className='add-Record' lang='ar' dir='rtl'>
        <div className='add-Record-body'>
          <div className="account">
            <div className="add-form-box">
              <form>
                <div className="form-three form-step active">
                  <h2>إنشاء حساب</h2>
                  <p>قم بتسجيل بيانات الحساب ثم قم بتسليمها لصاحبها كما هي لتفادي الأخطاء والمشاكل.</p>
                  <div>
                    <label>الاسم</label>
                    <input type="text" placeholder="اسم المستخدم" value={userName} onChange={(e) => setUserName(e.target.value)} />
                  </div>
                  <div>
                    <label>كلمة المرور</label>
                    <input type='text' placeholder='كلمة المرور' value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <div>
                    <label>فئة المستخدم</label>
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                      <option value="Patient">مريض</option>
                      <option value="Related">مسؤول عن مريض</option>
                    </select>
                  </div>
                </div>
                <div className="btn-add-group">
                  <button type="button" className="btn-submit" onClick={handleSubmit}>تأكيد</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      ) : content === 'link' ? (
        <div className='add-Record' lang='ar' dir='rtl'>
        <div className='add-Record-body'>
          <div className="account">
            <div className="add-form-box">
              <form>
                <div className="form-three form-step active">
                  <h2>ربط حساب</h2>
                  <p>قم بإدخال معرف الحساب و معرف السجل المرادَين.</p>
                  <div>
                    <label>معرِّف الحساب</label>
                    <input type="text" value={accountId} onChange={(e) => setAccountId(e.target.value)} />
                  </div>
                  <div>
                    <label>معرِّف السجل</label>
                    <input type='text' value={recordId} onChange={(e) => setRecordId(e.target.value)} />
                  </div>
                </div>
                <div className="btn-add-group">
                  <button type="button" className="btn-submit" onClick={handleSubmitlink}>تأكيد</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      ) : (
        <div>لا شيء للعرض</div>
      ) }
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

export default UserSection;
