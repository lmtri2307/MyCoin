import { Grid } from "@mui/material";
import { useContext, useState } from "react";
import { MainContext } from "../../../contexts/MainContext";
import DashboardContent from "../DashboardContent";
import Paper from "../Paper";
import BlockCard from "./BlockCard";
import BlockDetail from "./BlockDetail";

export default function DashboardBlockchain() {
  const { blockchainService } = useContext(MainContext);
  const blocks = blockchainService.getBlocks();
  const [currentBlockHash, setCurrentBlockHash] = useState();

  return (
    <DashboardContent>
      <Paper>
        
        <Grid container p={3} columnSpacing={2}>
          {blocks.map((block, index) => (
            <Grid item key={block.hash} xs={3}>
              <BlockCard
                handleClick={() => setCurrentBlockHash(block.hash)}
                no={index + 1}
                hash={block.hash}
                previousHash={block.previousHash}
                validator={block.validator}
                timestamp={block.timestamp}
              />
            </Grid>)
          )}
        </Grid>

      </Paper>
      {currentBlockHash && <BlockDetail blockHash={currentBlockHash}/>}
    </DashboardContent>
  );
}