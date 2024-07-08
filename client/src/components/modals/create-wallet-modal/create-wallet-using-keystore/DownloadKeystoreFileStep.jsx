import { Stack } from "@mui/material";
import { useContext } from "react";
import { CreateWalletUsingKeystoreContext } from "../../../../contexts/CreateWalletUsingKeystoreContext";
import { StepperContext } from "../../../../contexts/StepperContext";
import ContainedButton from "../../../buttons/ContainedButton";
import OutlinedButton from "../../../buttons/OutlinedButton";
import ModalStepHeader from "../../ModalStepHeader";
import { importantThings } from "./constants";
import KeystoreFileImportantThingCard from "./KeystoreFileImportantThingCard";

export default function DownloadKeystoreFileStep() {
  const { file, downloadLink } = useContext(CreateWalletUsingKeystoreContext);
  const { handleNext, handleBack } = useContext(StepperContext);

  return (
    <Stack spacing={3}>
      <ModalStepHeader
        headline="STEP 2."
        title="Download keystore file"
        description=" Important things to know before downloading your keystore file. "/>

      <Stack flexDirection="row" justifyContent="space-between">
        {importantThings.map(thing => (
          <KeystoreFileImportantThingCard
            key={thing.title}
            imagePath={thing.imagePath}
            imageAlt={thing.imageAlt}
            title={thing.title}
            description={thing.description}
          />
        ))}
      </Stack>
      <Stack flexDirection="row" justifyContent="center">
        <OutlinedButton
          style={{
            marginRight: "8px",
          }}
          onClick={() => handleBack()}>
          Back
        </OutlinedButton>
        
        <ContainedButton onClick={() => handleNext()}>
          <a download={file} href={downloadLink}>
            Acknowledge & Download
          </a>
        </ContainedButton>
      </Stack>
    </Stack>
  );
}