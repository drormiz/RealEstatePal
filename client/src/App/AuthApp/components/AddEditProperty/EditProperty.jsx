import React from 'react';
import {getClient} from '../../../../axios'; 
import AddEditProperty from './AddEditProperty';
import { useLocation } from 'react-router-dom';

const EditProperty = () => {
  const location = useLocation();
  const onSubmitHandler = async(updatedValue) => {
    await getClient().put(`api/properties/${updatedValue._id}`, updatedValue);

  };

  return (
    <AddEditProperty value={location.state ? location.state.property : null} onSubmitHandler={onSubmitHandler}></AddEditProperty>
      );
};

export default EditProperty;
