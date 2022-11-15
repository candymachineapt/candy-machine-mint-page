import {Button, Modal, Portal, SimpleGrid, Tooltip} from "@mantine/core";
import {IconZoomQuestion, IconWallet} from "@tabler/icons";
import React, {useMemo, useState} from "react";
import addressOperation from "../../utils/address";
import useAptosClient from "../../hooks/aptosClient/useAptosClient";
import {useWallet, Wallet, WalletName} from "@manahippo/aptos-wallet-adapter";
import {WalletConnector} from "./WalletConnector";

export function WalletConnectButton() {
    const {network} = useAptosClient();
    const {account, connect, connected, disconnect, wallets} = useWallet();

    const maskedAddress = useMemo(() => {
        return addressOperation.mask(account?.address?.toString());
    }, [account]);

    const ref = React.createRef<HTMLButtonElement>();
    const [isConnecting, setIsConnecting] = useState(false);

    const [opened, setOpened] = useState(false);

    const connectMe = async (walletName: WalletName) => {
        try {
            setIsConnecting(true);
            await connect(walletName);

        } catch (error) {
            console.log(error);
        } finally {
            setIsConnecting(false);
            setOpened(false);
        }
    }

    const buttonText = useMemo(() => {
        if (connected) {
            return maskedAddress + " - Disconnect";
        }

        return "Connect Wallet";
    }, [connected, maskedAddress]);

    return (
        <>
            <Tooltip label="You can change it through your wallet">
                <Button leftIcon={<IconZoomQuestion size={14}/>} variant="light" color="gray" compact fullWidth
                        mb="sm">{network ? network?.name : "Invalid network"}</Button>
            </Tooltip>
            <Button variant="light" color="teal" fullWidth
                    onClick={() => {
                        connected ? disconnect() : setOpened(true)
                    }} ref={ref} leftIcon={<IconWallet size={14}/>}
                    loading={isConnecting}
            >
                {buttonText}
            </Button>
            <Portal>
                <Modal
                    size="auto"
                    withCloseButton={false}
                    centered
                    opened={opened}
                    onClose={() => setOpened(false)}>
                    <SimpleGrid cols={6}>
                        {showWallets(wallets, connectMe)}
                    </SimpleGrid>
                </Modal>
            </Portal>
        </>
    );
}

function showWallets(wallets: Wallet[], connectMe: Function) {
    const comps = [];
    for (let i = 0; i < wallets.length; i++) {
        const wallet = wallets[i];
        comps.push((
            <React.Fragment key={wallet.adapter.name}>
                <WalletConnector connectMe={connectMe} wallet={wallet}/>
            </React.Fragment>));
    }

    return comps;
}