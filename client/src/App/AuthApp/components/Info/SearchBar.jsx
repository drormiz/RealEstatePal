import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

function SearchBar() {
  return (
    <TextField 
      variant="outlined"
      placeholder="שאלות נוספות..."
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      style={{ width: '100%', direction: 'rtl' }}
    />
  );
}

export default SearchBar;