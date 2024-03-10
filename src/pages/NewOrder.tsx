import { ChangeEvent, FormEvent, useState } from 'react';
import { AxiosError } from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import appServices from '../services/appServices';

type EditProductProps = {
  product_line: string;
  quantity: number;
};

const NewOrder = () => {
  const [formValues, setFormValues] = useState({
    product_line: '',
    quantity: '',
  });
  const [order, setOrder] = useState<string[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const { data } = useQuery({
    retry: false,
    queryKey: ['product_lines'],
    queryFn: () => appServices.fetchProductLines(),
  });

  const mutation = useMutation({
    mutationKey: ['create_products'],
    mutationFn: (formValues: EditProductProps) => appServices.newOrder(formValues),
    onError: (error: AxiosError) => {
      console.log(error?.response);
    },
    onSuccess: (response) => {
      setOrder([]);
      for (const key in response) {
        setOrder((prevState) => [...prevState, `${response[key]} x ${key}`]);
      }
    },
  });

  const handleCreateOrder = (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      product_line: formValues.product_line,
      quantity: Number(formValues.quantity),
    };
    mutation.mutate(payload);
  };

  return (
    <div className='flex relative mt-20'>
      <div className='px-8 pt-6 pb-8 rounded-md w-2/6 mx-auto my-auto bg-neutral-100 shadow-md'>
        <h2 className='font-bold text-2xl text-center pb-6'>New Order</h2>
        <form action='' onSubmit={handleCreateOrder} className='flex flex-col justify-center'>
          <div className='pb-4'>
            <label htmlFor='product_line' className='block font-medium pb-1 text-gray-800'>
              Product line
            </label>
            <select
              name='product_line'
              onChange={handleChange}
              id='product_line'
              className='px-4 py-1.5 w-full mx-auto border border-gray-400 rounded outline-none'
            >
              <option disabled selected>
                Select a product line
              </option>
              {data?.map((product_line: Array<string>, index: number) => (
                <option key={index} value={product_line}>
                  {product_line}
                </option>
              ))}
            </select>
          </div>
          <div className='pb-4'>
            <label htmlFor='quantity' className='block font-medium pb-1 text-gray-800'>
              Quantity
            </label>
            <input
              type='text'
              className='px-4 py-1.5 w-full mx-auto border border-gray-400 rounded outline-none'
              value={formValues.quantity}
              onChange={handleChange}
              name='quantity'
              id='quantity'
              placeholder='Enter a quantity'
            />
          </div>
          <button
            className='flex justify-center items-center font-bold bg-black w-full mt-6 text-white px-3 py-2 rounded-full uppercase mx-auto disabled:bg-gray-400'
            disabled={!formValues.product_line || !formValues.quantity}
          >
            {mutation.isPending ? 'Loading' : 'Create order'}
          </button>
        </form>
      </div>
      {order?.length && (
        <div className='px-4 pt-6 rounded-md max-w-xs absolute right-24 my-auto bg-neutral-100 shadow-md'>
          <h4 className='font-medium text-lg pb-6'>Your order would be shipped in this pack size variation:</h4>
          <div className='pb-4'>
            {order?.map((item, index: number) => (
              <p key={index} className='pb-2'>
                {item} pack size
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default NewOrder;
