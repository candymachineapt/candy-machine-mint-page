import {ReactNode, FC, useEffect} from "react";
import useAptosClient from "../aptosClient/useAptosClient";
import {useWallet} from "@manahippo/aptos-wallet-adapter";
import { mapNetwork } from "../../services/aptos/client/AptosNetwork";

export interface NetworkAdapterProps {
    children: ReactNode;
}

export const NetworkAdapter: FC<NetworkAdapterProps> = ({children}) => {
    const {setNetwork} = useAptosClient();
    const {network} = useWallet();

    useEffect(() => {
        if (network === null || network.name === undefined) {
            setNetwork(null);
            return;
        }
        const aptosNetwork = mapNetwork(network.name.toString());
        console.log(aptosNetwork)

        setNetwork(aptosNetwork);
    }, [network]);

    return (
        <>
        {children}
        </>
    );
}