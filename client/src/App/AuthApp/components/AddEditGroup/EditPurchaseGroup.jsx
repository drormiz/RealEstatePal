import React from 'react';
import {getClient} from '../../../../axios'; 
import AddEditGroup from './AddEditPurchaseGroup';
import { useLocation } from 'react-router-dom';

const EditGroup = () => {
  const location = useLocation();
  const onSubmitHandler = async(updatedValue) => {
  };

  return (
    <AddEditGroup value={location.state ? location.state.group : null} onSubmitHandler={onSubmitHandler}></AddEditGroup>
      );
};

export default EditGroup;
