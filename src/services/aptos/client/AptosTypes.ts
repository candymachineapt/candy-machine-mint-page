export interface AptosCollection {
    creator: string;
    collection_name: string;
    uri: string;
    description: string;
    maximum: number;
}

export interface CandyMachineEvent {
    type: string;
    counter: number;
}

export interface AptosTokenData {
    id: AptosTokenDataId;
    name: string;
    description: string;
    maximum: number,
    uri: string;
    royalty_payee_address: string,
    royalty_points_denominator: number,
    royalty_points_numerator: number,
    property_keys: string[],
    property_values: string[],
    property_types: string[]
}

export interface AptosTokenDataId {
    creator: string;
    // The collection or set of related tokens within the creator's account
    collection: string;
    // the name of this token
    name: string;
}

export interface CandyMachineInfo {
    creator: string;
    address: string;
    state: CandyMachineState;
    left_amount_of_candy: number;
    candies: (AptosTokenDataId | any)[];
    sell_price: number;

    // internals
    sold_candies: number;
    percentage_of_sold: number;
    fixed_sell_price: number;
}

export enum CandyMachineState {
    Unknown = -1,
    Initial = 0,
    Active = 1,
    Idle = 2,
    Final = 3
}

export type CreateCandyMachineRequest = {
    seed: string;
}

export type CreateCollectionRequest = {
    candyMachineAddress: string;
    name: string;
    description: string;
    url: string;
    size: number;
}

export type CreateTokenRequest = {
    candyMachineAddress: string;
    collectionName: string;
    name: string;
    description: string;
    maximum: number;
    uri: string;
    royaltyPayeeAddress: string;
    royaltyPointsDenominator: number;
    royaltyPointsNumerator: number;
    properties: TokenProperty[]
}

export type CreateTokensOfOffChainRequest = {
    candyMachineAddress: string;
    collectionName: string;
    tokenBaseName: string;
    tokenCommonDescription: string;
    tokenBaseUri: string;
    tokenBaseUriSuffix: string;
    tokenBaseUriStartIndex: number;
    tokenBaseUriFinishIndex: number;
    royaltyPayeeAddress: string;
    royaltyPointsDenominator: number;
    royaltyPointsNumerator: number;
}

export type TokenProperty = {
    key: string;
    value: string;
}

export type CreateStartCandyMachineRequest = {
    candyMachineAddress: string;
}

export type CreateMintRequest = {
    candyMachineAddress: string;
}

export type CreatePauseCandyMachineRequest = {
    candyMachineAddress: string;
}

export type CreateResumeCandyMachineRequest = {
    candyMachineAddress: string;
}

export type CreateTerminateCandyMachineRequest = {
    candyMachineAddress: string;
}

export type CreateWithdrawRequest = {
    candyMachineAddress: string;
}

export type UpdateSellPriceRequest = {
    candyMachineAddress: string;
    newPrice: number;
}