import {Button, Container, Title, Notification, Space } from "@mantine/core";
import {useEffect, useState} from "react";
import useAptosClient from "../hooks/aptosClient/useAptosClient";
import {CandyMachineState, CreateMintRequest} from "../services/aptos/client/AptosTypes";
import { EntryFunctionPayload } from "../services/CommonTypes";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import {WalletConnectButton} from "./web3/WalletConnectButton";
import { IconX } from "@tabler/icons";

export default function MintPage() {
    const {signAndSubmitTransaction, connect} = useWallet();
    const {client, candyMachineService, network} = useAptosClient();
    const candyMachineAddress = process.env.REACT_APP_CANDY_MACHINE_ADDRESS;
    const wantedNetwork = process.env.REACT_APP_APTOS_NETWORK;
    const appTitle = process.env.REACT_APP_TITLE;
    const [error, setError] = useState<string | null>();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (candyMachineAddress === undefined) return;

        const request: CreateMintRequest = {
            candyMachineAddress: candyMachineAddress
        };
        const payload: EntryFunctionPayload = candyMachineService.createStarMintPayload(request);

        await connect();

        const transactionHash = await signAndSubmitTransaction(payload);
        console.log(transactionHash);
        await client.waitForTransactionWithResult(transactionHash.hash);
    }

    useEffect(() => {
        console.log(candyMachineAddress);
        if (candyMachineAddress === undefined) {
            setError("Candy machine address is not initialized");
            return;
        }

        if (wantedNetwork !== network?.name) {
            setError("You are wrong network. You need to change it through your wallet with " + wantedNetwork);
            return;
        }

        candyMachineService.getCandyMachineInfo(candyMachineAddress).then((info) => {
            if (!info) {
                setError("Invalid candy machine address");
                return;
            }

            if (info.state !== CandyMachineState.Active) {
                setError("Candy machine is not active");
                return;
            }

            setError(null);
        });
    }, [setError, network, client]);

    return (
        <Container size="sm">
            <Title align="center">
                {appTitle} - Mint Page
            </Title>
            <Space h="md"/>
            <WalletConnectButton />
            <Space h="md"/>
            <form onSubmit={handleSubmit}>
                { error &&
                    <Notification icon={<IconX size={18} />} color="red">
                        {error}
                    </Notification>
                }
                { !error &&
                    <Button fullWidth type="submit" mt="md">Mint</Button>
                }
            </form>
        </Container>
    )
}