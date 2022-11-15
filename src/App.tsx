import React from 'react';

import {AptosClientProvider} from './hooks/aptosClient/AptosClientProvider';
import {WalletProviderAdapter} from './hooks/web3/WalletProviderAdapter';
import { NetworkAdapter } from './hooks/web3/NetworkAdapter';
import MintPage from './components/MintPage';

function App() {
    return (
        <AptosClientProvider>
            <WalletProviderAdapter>
                <NetworkAdapter>
                    <MintPage />
                </NetworkAdapter>
            </WalletProviderAdapter>
        </AptosClientProvider>
    );
}

export default App;
