import { useSnackbar } from "notistack";

import DomainScreen from "screens/Marketplace/DomainScreen";

import { downloadMarketplaceProductExcelService } from "services/Ingest/dataset-service";

const DomainController = () => {
    const { enqueueSnackbar } = useSnackbar();

    const handleDownloadExcel = async (
        productName: string
    ) => {
        console.log("CLICK DOWNLOAD");
        console.log(productName);

        try {
            await downloadMarketplaceProductExcelService(
                "pd",
                "raw-dev-osc-cdp-bucket",
                productName
            );

            enqueueSnackbar(
                "Excel descargado correctamente.",
                {
                    variant: "success",
                }
            );
        } catch (error) {
            console.error(error);

            enqueueSnackbar(
                "Error descargando Excel.",
                {
                    variant: "error",
                }
            );
        }
    };

    return (
        <DomainScreen
            onDownloadExcel={handleDownloadExcel}
        />
    );
};

export default DomainController;