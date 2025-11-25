import { AxiosInstance } from "axios";
import MockAdapter from "axios-mock-adapter";
import connectMainMocks from "services/Main/mocks/mock-connector";

/**
 * MockAdapter to simulate responses for endpoint
 * enable true will wrap the axiosObject with the MockAdapter
 * @param axiosObj
 * @param enable
 */
const MockApi = (
  axiosObj: AxiosInstance,
  enable: boolean
) => {
  if (!enable) {
    return axiosObj;
  } else {
    const mock = new MockAdapter(axiosObj, {
      onNoMatch: "passthrough",
      delayResponse: 500,
    });

    connectMainMocks(mock);
    return axiosObj;
  }
  return axiosObj;
};

export default MockApi;
