'use client';

import React, { useState } from 'react';
import { BsMoonFill, BsSunFill } from 'react-icons/bs';

const themes = {
	halloween: 'halloween',
	autumn: 'autumn',
	// cyberpunk: 'cyberpunk',
};

const ThemeToggle = () => {
	const [theme, setTheme] = useState(themes.halloween);

  const toggleTheme = () => {
    const newTheme = theme === themes.halloween ? themes.autumn : themes.halloween;
    document.documentElement.setAttribute('data-theme', newTheme);
    setTheme(newTheme);
  }

	return (
    <button className='btn btn-sm btn-outline' onClick={toggleTheme}>
      {theme === 'halloween'? <BsMoonFill className='h-4 w-4' /> : <BsSunFill className='h-4 w-4' />}
    </button>
  )
};

export default ThemeToggle;
