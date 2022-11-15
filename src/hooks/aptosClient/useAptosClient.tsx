import React, {useContext} from "react"
import {AptosClient} from "aptos";
import {AptosNetwork, Mainnet, mapNetwork} from "../../services/aptos/client/AptosNetwork";
import {TokenService} from "../../services/aptos/client/TokenServices";
import { CandyMachineService } from "../../services/aptos/client/CandyMachineService";

export interface AptosClientState {
    client: AptosClient;
    network: AptosNetwork | null;
    setNetwork: (network: AptosNetwork | null) => void;
    tokenService: TokenService;
    candyMachineService: CandyMachineService;
}

const defaultClient = new AptosClient(Mainnet.connectionUrl);
const defaultAptosClientState: AptosClientState = {
    client: defaultClient,
    network: Mainnet,
    setNetwork: (network: AptosNetwork | null) => {},
    tokenService: new TokenService(defaultClient),
    candyMachineService: new CandyMachineService(defaultClient)
}

export const AptosClientContext = React.createContext<AptosClientState>(defaultAptosClientState);

export default function useAptosClient() {
    return useContext(AptosClientContext);
}