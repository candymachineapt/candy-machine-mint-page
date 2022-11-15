import {Button} from "@mantine/core";
import {IconEggCracked} from "@tabler/icons";
import React from "react";
import useAptosClient from "../hooks/aptosClient/useAptosClient";
import {EntryFunctionPayload} from "../services/CommonTypes";
import {CreateMintRequest} from "../services/aptos/client/AptosTypes";
import { useWallet } from "@manahippo/aptos-wallet-adapter";

export interface MintButtonProps {
    candyMachineAddress: string;
    onChangeCallback: Function;
}

export function MintButton({candyMachineAddress, onChangeCallback}: MintButtonProps) {
    const {client, candyMachineService} = useAptosClient();
    const {signAndSubmitTransaction} = useWallet();
    const ref = React.createRef<HTMLButtonElement>();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!ref.current) return;
        if (!candyMachineAddress) return;

        const request: CreateMintRequest = {
            candyMachineAddress: candyMachineAddress
        };
        const payload: EntryFunctionPayload = candyMachineService.createStarMintPayload(request);

        const transactionHash = await signAndSubmitTransaction(payload);
        console.log(transactionHash);
        await client.waitForTransactionWithResult(transactionHash.hash);

        onChangeCallback();
    }

    return (
        <Button disabled={!candyMachineAddress} variant="light" fullWidth={true}
                onClick={handleSubmit} ref={ref} leftIcon={<IconEggCracked size={14}/>}>
            Mint
        </Button>
    );
}