import { MintService } from "../services/mint.service";

export const addressLabel = (address) => {
    if (address === MintService.MINT_PUBLIC_ADDRESS) {
        return "System";
    }
    return address;
}
