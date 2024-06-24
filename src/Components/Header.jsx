import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';


const Header = ({ search, onSearch }) => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const handleWoman = () => {
    navigate('/addwoman')
  }

  const handleChild = () => {
    navigate('/addchild')
  }

  const handleSearchClick = () => {
    onSearch(searchValue);
  };

  return (
    <div className="header--wrapper">
      {search === 'patients' ? (
        <div className='header-div'>
        <div className={searchValue === '' ? 'non-active-search-box' : 'active-search-box'}>
          <FontAwesomeIcon icon={faSearch} className='header-icon' />
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
            placeholder="البحث عن مريض"
            value={searchValue}
          />
          <FontAwesomeIcon icon={faArrowLeft} className={searchValue === '' ? 'no' : 'arrow-icon'} onClick={handleSearchClick} />
        </div>
        <div className='Icons-add-header'>
          <p onClick={handleChild}>إضافة طفل</p>
          <p onClick={handleWoman}>إضافة امرأة</p>
        </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Header;
