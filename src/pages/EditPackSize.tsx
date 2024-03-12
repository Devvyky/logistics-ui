import {
  ChangeEvent,
  FormEvent,
  useState,
  SetStateAction,
  useEffect,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import appServices from "../services/appServices";

type EditPackSizeProps = {
  product_line: string;
  pack_size: number;
};

type ModalProps = {
  id: string;
  setModalVisible: React.Dispatch<SetStateAction<boolean>>;
};

const EditPackSize = ({ id, setModalVisible }: ModalProps) => {
  const queryClient = useQueryClient();

  const [formValues, setFormValues] = useState({
    product_line: "",
    pack_size: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const { data } = useQuery({
    retry: false,
    queryKey: ["pack_size"],
    queryFn: () => appServices.getPackSize(id),
  });

  useEffect(() => {
    if (data) {
      setFormValues({
        product_line: data?.product_line || "",
        pack_size: data?.pack_size || "",
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationKey: ["edit_pack_size"],
    mutationFn: (formValues: EditPackSizeProps) =>
      appServices.editPackSize(id, formValues),
    onError: () => {
      toast.error("Something went wrong, try again later");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pack_sizes"] });
      toast.success("Product line edited successfully");
      setModalVisible(false);
    },
  });

  const handleEdit = (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      product_line: formValues.product_line,
      pack_size: Number(formValues.pack_size),
    };
    mutation.mutate(payload);
  };

  return (
    <div className="fixed h-full w-full top-0 left-0 bg-black bg-opacity-80 z-50">
      <div className="px-8 pt-6 relative pb-8 rounded-md max-w-lg mx-auto mt-24 bg-neutral-100 shadow-md">
        <h2 className="font-bold text-2xl text-center pb-6">Edit Pack Size</h2>
        <button
          onClick={() => setModalVisible(false)}
          className="text-4xl absolute top-4 right-6"
        >
          &times;
        </button>
        <form
          action=""
          onSubmit={handleEdit}
          className="flex flex-col justify-center"
        >
          <div className="pb-4">
            <label
              htmlFor="product_line"
              className="block font-medium pb-1 text-gray-800"
            >
              Product line
            </label>
            <input
              type="text"
              className="px-4 py-1.5 w-full mx-auto border border-gray-400 rounded outline-none"
              value={formValues.product_line}
              onChange={handleChange}
              name="product_line"
              id="product_line"
              placeholder="Enter a product line"
            />
          </div>
          <div className="pb-4">
            <label
              htmlFor="pack_size"
              className="block font-medium pb-1 text-gray-800"
            >
              Pack size
            </label>
            <input
              type="number"
              className="px-4 py-1.5 w-full mx-auto border border-gray-400 rounded outline-none"
              value={formValues.pack_size}
              onChange={handleChange}
              name="pack_size"
              id="pack_size"
              placeholder="Enter a pack size"
            />
          </div>
          <button className="flex justify-center items-center font-bold bg-black w-full mt-6 text-white px-3 py-2 rounded-full uppercase mx-auto">
            {mutation.isPending ? "Saving" : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default EditPackSize;
