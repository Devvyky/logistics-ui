import request from "./index";

const appServices = {
  async createPackSize(body: { product_line: string; pack_size: number }) {
    return request.post("/products", body).then(async ({ data }) => data);
  },
  async listPackSizes(product_line: string) {
    return request
      .get(`/products?product_line=${product_line}`)
      .then(async ({ data }) => data);
  },
  async getPackSize(id: string) {
    return request.get(`/products/${id}`).then(async ({ data }) => data);
  },
  async editPackSize(
    id: string,
    body: { product_line: string; pack_size: number }
  ) {
    return request.put(`/products/${id}`, body).then(async ({ data }) => data);
  },
  async deletePackSize(id: string) {
    return request.delete(`/products/${id}`).then(async ({ data }) => data);
  },
  async newOrder(body: { product_line: string; quantity: number }) {
    return request.post(`/orders`, body).then(async ({ data }) => data);
  },
  async fetchProductLines() {
    return request.get(`/products/lines`).then(async ({ data }) => data);
  },
};

export default appServices;
