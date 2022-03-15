import { APICore } from "./index";

const api = new APICore();

export const getAllContracts = async () => {
  return await api.get("/blockchain/contracts?enabled=true").then((resp) => resp.data.data);
};
