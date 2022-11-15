import {FC, ReactNode, useCallback, useEffect} from "react";
import {AptosClientContext} from "./useAptosClient";
import {AptosNetwork, Mainnet} from "../../services/aptos/client/AptosNetwork";
import {AptosClient} from "aptos";
import {CandyMachineService} from "../../services/aptos/client/CandyMachineService";
import {TokenService} from "../../services/aptos/client/TokenServices";
import React from "react";

export interface AptosClientProviderProps {
    children: ReactNode;
}

export const AptosClientProvider: FC<AptosClientProviderProps> = ({children}) => {
    const [aptosNetwork, setAptosNetwork] = React.useState<AptosNetwork | null>(Mainnet);
    const [client, setClient] = React.useState<AptosClient>(new AptosClient(Mainnet.connectionUrl));
    const [candyMachineService, setCandyMachineService] = React.useState<CandyMachineService>(new CandyMachineService(client));
    const [tokenService, setTokenService] = React.useState<TokenService>(new TokenService(client));

    const setNetwork = useCallback((network: AptosNetwork | null) => {
        setAptosNetwork(network);
    }, [setAptosNetwork, setClient]);

    useEffect(() => {
        setNetwork(aptosNetwork);

        if (!aptosNetwork) return;
        const c = new AptosClient(aptosNetwork.connectionUrl);
        setClient(c);
        setCandyMachineService(new CandyMachineService(c));
        setTokenService(new TokenService(c));
    }, [aptosNetwork, setNetwork]);

    return (
        <AptosClientContext.Provider value={{client, network: aptosNetwork, setNetwork, candyMachineService, tokenService}}>
            {children}
        </AptosClientContext.Provider>
    );
}