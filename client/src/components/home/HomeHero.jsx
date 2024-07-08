import { Box, Stack, styled, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ContainedButton from "../buttons/ContainedButton";
import OutlinedButton from "../buttons/OutlinedButton";
import CreateWalletModal from "../modals/create-wallet-modal/CreateWalletModal";
import AccessWalletModal from "../modals/access-wallet-modal/AccessWalletModal";
import HomeHeroImage from "./HomeHeroImage";

const Wrapper = styled(({ ...props }) => <Box {...props} />)({
  width: "100%",
  height: "800px",
  backgroundColor: "#184f90",
  backgroundImage: "url('./images/home/bg-homepage.svg')",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "100% bottom",
});

const Container = styled(({ ...props }) => <Stack {...props} />)({
  maxWidth: "1185px",
  height: "100%",
  padding: "12px",
  margin: "0 auto",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
});

export default function HomeHero() {
  const navigate = useNavigate();

  const [isCreateWalletModalOpen, setIsCreateWalletModalOpen] = useState(false);
  const [isAccessWalletModalOpen, setIsAccessWalletModalOpen] = useState(false);

  const handleOpenCreateWalletModal = () => setIsCreateWalletModalOpen(true);

  const handleCloseCreateWalletModal = () => {
    setIsCreateWalletModalOpen(false);
    navigate("/", { replace: "true" });
  };

  const handleOpenAccessWalletModal = () => setIsAccessWalletModalOpen(true);

  const handleCloseAccessWalletModal = () => {
    setIsAccessWalletModalOpen(false);
    navigate("/", { replace: "true" });
  };
  
  return (
    <Wrapper>
      <Container>
        <Box>
          <Box
            sx={{
              maxWidth: "430px",
            }}
          >
            <Typography fontSize="43px" color="white" fontWeight={700}>
              Ethereum's Original Wallet
            </Typography>
            <Typography fontSize="14px" color="white" marginTop={1.5}>
              MEW (MyEtherWallet) is a free, client-side interface helping you
              interact with the Ethereum blockchain. Our easy-to-use,
              open-source platform allows you to generate wallets, interact with
              smart contracts, and so much more.
            </Typography>
          </Box>
          <Stack flexDirection="row" marginTop={4}>
            <ContainedButton
              style={{
                marginRight: "10px",
              }}
              onClick={handleOpenCreateWalletModal}
            >
              Create a new wallet
            </ContainedButton>
            <CreateWalletModal
              open={isCreateWalletModalOpen}
              handleClose={handleCloseCreateWalletModal}
            />
            <OutlinedButton onClick={handleOpenAccessWalletModal}>
              Access my wallet
            </OutlinedButton>
            <AccessWalletModal
              open={isAccessWalletModalOpen}
              handleClose={handleCloseAccessWalletModal}
            />
          </Stack>
        </Box>
        <HomeHeroImage />
      </Container>
    </Wrapper>
  );
}