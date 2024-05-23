import React from 'react';
import {getClient} from '../../../../axios'; 
import AddEdiGroup from './AddEditPurchaseGroup';

const AddGroup = () => {
 
  const onSubmitHandler = async(newValue) => {
    await getClient().post(`api/purchaseGroups`,newValue);
  };

  return (
    <AddEdiGroup onSubmitHandler={onSubmitHandler}></AddEdiGroup>
      );
};

export default AddGroup;
