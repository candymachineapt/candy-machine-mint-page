export interface AptosNetwork {
    name: string;
    connectionUrl: string;
}

export const Devnet: AptosNetwork = {
    name: "Devnet",
    connectionUrl: 'https://fullnode.devnet.aptoslabs.com/v1'
}

export const Testnet: AptosNetwork = {
    name: "Testnet",
    connectionUrl: 'https://fullnode.testnet.aptoslabs.com/v1'
}

export const Mainnet: AptosNetwork = {
    name: "Mainnet",
    connectionUrl: 'https://fullnode.mainnet.aptoslabs.com/v1'
}

const registry = new Map<string, AptosNetwork>();
registry.set("Devnet", Devnet);
registry.set("Testnet", Testnet);
registry.set("Mainnet", Mainnet);

export const mapNetwork = (network: string): (AptosNetwork | null) => {
    const isExists = registry.has(network);
    if (!isExists) {
        return null;
    }

    return registry.get(network) ?? null;
}