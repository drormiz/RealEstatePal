import React from 'react';
import {getClient} from '../../../../axios'; 
import AddEdiGroup from './AddEditPurchaseGroup';

const AddGroup = () => {
 
  const onSubmitHandler = async(newValue) => {
  };

  return (
    <AddEdiGroup onSubmitHandler={onSubmitHandler}></AddEdiGroup>
      );
};

export default AddGroup;
