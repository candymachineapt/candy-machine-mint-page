import React, {useMemo} from "react";
import {FC, ReactNode} from "react";

import {
    WalletProvider,
    AptosWalletAdapter,
    MartianWalletAdapter,
    FewchaWalletAdapter,
    PontemWalletAdapter,
    SpikaWalletAdapter,
    RiseWalletAdapter,
    TokenPocketWalletAdapter,
    BitkeepWalletAdapter,
    NightlyWalletAdapter,
    HyperPayWalletAdapter
} from '@manahippo/aptos-wallet-adapter';

export interface WalletProviderAdapterProps {
    children: ReactNode;
}

export const WalletProviderAdapter: FC<WalletProviderAdapterProps> = ({children}) => {
    const wallets = useMemo(
        () => [
            new AptosWalletAdapter(),
            new MartianWalletAdapter(),
            new PontemWalletAdapter(),
            new RiseWalletAdapter(),
            new FewchaWalletAdapter(),
            new BitkeepWalletAdapter(),
            new SpikaWalletAdapter(),
            new NightlyWalletAdapter(),
            new TokenPocketWalletAdapter(),
            new HyperPayWalletAdapter()
        ],
        []
    );
    return (
        <WalletProvider
            wallets={wallets}
            autoConnect
            onError={(error: Error) => {
                let text = 'Unknow error';
                if (error.name === 'WalletNotReadyError') {
                    text = 'Wallet not ready';
                }
                //openErrorNotification({ detail: error.message || text, title: 'Wallet Error' });
                console.log(error);
            }}>
            {children}
        </WalletProvider>
    );
}