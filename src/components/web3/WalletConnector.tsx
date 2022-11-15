import {Wallet, WalletReadyState} from "@manahippo/aptos-wallet-adapter";
import {Avatar, Button, Paper, Text} from "@mantine/core";

export interface WalletConnectorProps {
    wallet: Wallet;
    connectMe: Function;
}

export function WalletConnector({wallet, connectMe}: WalletConnectorProps) {
    const readyToConnect = wallet.readyState === WalletReadyState.Installed;
    const action = readyToConnect ? () => connectMe(wallet.adapter.name) : () => window.open(wallet.adapter.url, "_blank");

    return (
        <Paper
            radius="md"
            withBorder
            p="lg"
            sx={(theme) => ({
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
            })}
            >
            <Avatar src={wallet.adapter.icon} size={32} radius={32} mx="auto" />
            <Text align="center" size="lg" weight={500} mt="md">
                {wallet.adapter.name}
            </Text>

            <Button variant="default" fullWidth mt="md" onClick={() => action()}>
                {readyToConnect ? "Connect" : "Install"}
            </Button>
        </Paper>
    );
}