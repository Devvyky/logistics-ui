import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import appServices from "../services/appServices";
import { formatDate } from "../utils";
import EditPackSize from "./EditPackSize";

type PackSizeProps = {
  created_at: string;
  id: string;
  pack_size: number;
  product_line: string;
  updated_at: string;
};

const PackSize = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { product_line } = useParams();

  const [modalVisible, setModalVisible] = useState(false);
  const [id, setId] = useState("");

  const { data, isLoading } = useQuery({
    retry: false,
    queryKey: ["pack_sizes"],
    queryFn: () => appServices.listPackSizes(product_line as string),
  });

  const { isPending, mutate } = useMutation({
    mutationKey: ["delete_pack_size"],
    mutationFn: (id: string) => appServices.deletePackSize(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pack_sizes"] });
    },
  });

  const handleEdit = (id: string) => {
    setModalVisible(true);
    setId(id);
  };

  const handleDelete = (id: string) => {
    mutate(id);
  };

  return (
    <div className="mx-8 mt-10 mb-6">
      {modalVisible && (
        <EditPackSize id={id} setModalVisible={setModalVisible} />
      )}
      <div className="pb-6 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-0 left-[13.3%] font-medium"
        >
          &#8592; Back
        </button>
        <h2 className="text-center font-bold text-2xl pb-8">Pack Size</h2>
        {isLoading ? (
          <h2 className="text-center font-medium pt-8">Loading..</h2>
        ) : (
          <div className="pt-8 px-6">
            <table className="w-4/5 mx-auto">
              <thead>
                <tr className="text-gray-700 p-4">
                  <th>S/N</th>
                  <th>Date created</th>
                  <th>Product line</th>
                  <th>Pack size</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((product: PackSizeProps, index: number) => (
                  <tr
                    key={product?.id}
                    className="text-center border-b border-b-neutral-300"
                  >
                    <td className="py-4">{index + 1}</td>
                    <td className="py-4">{formatDate(product?.created_at)}</td>
                    <td className="py-4">{product?.product_line}</td>
                    <td className="py-4">{product?.pack_size}</td>
                    <td className="py-4">
                      <div className="flex justify-evenly">
                        <button
                          className="bg-black text-white rounded px-2 py-1"
                          onClick={() => handleEdit(product?.id)}
                        >
                          Edit
                        </button>
                        <button
                          disabled={isPending}
                          className="bg-red-500 text-white rounded px-2 py-1"
                          onClick={() => handleDelete(product?.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default PackSize;
