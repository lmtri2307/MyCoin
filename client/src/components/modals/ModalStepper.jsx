import {
  Box,
  Step,
  stepConnectorClasses,
  StepLabel,
  stepLabelClasses,
  Stepper,
} from "@mui/material";
import { useState } from "react";
import { StepperContext } from "../../contexts/StepperContext";

const stepperStyle = {
  padding: "24px 0 ",
};

const stepStyle = {
  flexBasis: "175px",
  padding: "0 24px",

  [`& .${stepConnectorClasses.lineHorizontal}`]: {
    borderColor: "#184F90",
  },
};

const stepLabelStyle = {
  [`& .${stepLabelClasses.iconContainer}`]: {
    svg: {
      color: "#184F90",
      width: "30px",
      height: "30px",

      text: {
        fontSize: "10.5px",
      },
    },
  },

  [`&.${stepLabelClasses.disabled}`]: {
    [`& .${stepLabelClasses.iconContainer}`]: {
      svg: {
        color: "rgba(0,0,0,.38)",
      },
    },
  },

  [`& .${stepLabelClasses.label}`]: {
    marginTop: "11px",
    fontWeight: 700,
  },
};

export default function ModalStepper({ steps, stepComponents }) {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    console.log("next");
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleRestart = () => {
    console.log("restart");
    setActiveStep(0);
  };
  console.log("activeStep", activeStep);

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep} sx={stepperStyle} alternativeLabel>
        {steps.map((label, index) => {
          return (
            <Step key={label} sx={stepStyle}>
              <StepLabel sx={stepLabelStyle}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <StepperContext.Provider
        value={{ handleNext, handleBack, handleRestart }}>
        {stepComponents[activeStep]}
      </StepperContext.Provider>
    </Box>
  );
}