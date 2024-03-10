import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import appServices from '../services/appServices';
import CreateProduct from './CreateProduct';

const LandingPage = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const { data, isLoading } = useQuery({
    retry: false,
    queryKey: ['product_lines'],
    queryFn: () => appServices.fetchProductLines(),
  });

  return (
    <div className='mx-8 mt-10 mb-6'>
      {modalVisible && <CreateProduct setModalVisible={setModalVisible} />}
      <div className='pb-6 relative'>
        <h2 className='text-center font-bold text-2xl pb-8'>Product Lines</h2>
        <div className='flex absolute right-0 top-0'>
          <button
            onClick={() => setModalVisible(true)}
            className='bg-stone-900 text-white px-4 py-2 mr-4 ml-auto rounded-lg'
          >
            Create pack size
          </button>
          <Link to='/order' className=' bg-stone-900 text-white px-4 py-2 ml-auto rounded-lg'>
            New order
          </Link>
        </div>
        {isLoading ? (
          <h2 className='text-center font-medium pt-2'>Loading..</h2>
        ) : (
          <div className='flex'>
            {data?.map((product_line: string, index: number) => (
              <Link to={`/product/${product_line}`} key={index} className='mx-2 font-medium'>
                {product_line}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default LandingPage;
