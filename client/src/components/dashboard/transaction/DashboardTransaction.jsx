import { useContext, useState } from "react";
import { MainContext } from "../../../contexts/MainContext";
import DashboardContent from "../DashboardContent";
import TransactionDetail from "./TransactionDetail";
import TransactionList from "./TransactionList";
import TransactionListItem from "./TransactionListItem";

export default function DashboardTransaction() {
  const { blockchainNetworkService } = useContext(MainContext);
  const blocks = blockchainNetworkService.blockchainService.getBlocks();
  const [currentTxHash, setCurrentTxHash] = useState();

  return (
    <DashboardContent>

      <TransactionList>
        {blocks.map(block =>
          block.transactions.map(tx => (
            <TransactionListItem
              key={tx.hash}
              handleClick={() => setCurrentTxHash(tx.hash)}
              txHash={tx.hash}
              fromAddress={tx.fromAddress}
              toAddress={tx.toAddress}
              amount={tx.amount}
            />
          )),
        )}
      </TransactionList>
      {currentTxHash && <TransactionDetail txHash={currentTxHash}/>}
    </DashboardContent>
  );
}