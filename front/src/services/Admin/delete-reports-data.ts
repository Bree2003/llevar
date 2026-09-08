import { AxiosDelete } from "services/utils";

import { ReportModel } from "models/Global/reportsModel";

export interface ReportDeleteResponse {
  message: string;
}

const deleteReportsData = async (
  data: ReportModel,
): Promise<ReportDeleteResponse | undefined> => {
  const response = await AxiosDelete(`/api/reports/${data.id}`, {});

  return response?.data;
};

export default deleteReportsData;
