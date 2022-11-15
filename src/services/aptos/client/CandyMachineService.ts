import {ApiError, AptosAccount, AptosClient, CoinClient} from "aptos";
import {EntryFunctionPayload} from "../../CommonTypes";
import { Mainnet } from "./AptosNetwork";
import {
    CandyMachineEvent,
    CandyMachineInfo,
    CandyMachineState,
    CreateCandyMachineRequest,
    CreateCollectionRequest,
    CreateMintRequest,
    CreateTokensOfOffChainRequest,
    CreatePauseCandyMachineRequest,
    CreateResumeCandyMachineRequest,
    CreateStartCandyMachineRequest,
    CreateTerminateCandyMachineRequest,
    CreateTokenRequest,
    CreateWithdrawRequest,
    UpdateSellPriceRequest
} from "./AptosTypes";

export class CandyMachineService {
    private readonly client: AptosClient;
    private readonly coinClient: CoinClient;
    private readonly CoreCandyMachineAddress: string;

    constructor(client: AptosClient) {
        this.client = client;
        this.coinClient = new CoinClient(client);

        if (client.nodeUrl === Mainnet.connectionUrl) {
            this.CoreCandyMachineAddress = "0x88e579563fad6dd96b17c9314badd081f667f443519a2512c0fbf95d462cc791";
        } else {
            this.CoreCandyMachineAddress = "0x69c60de3c31db89d9fe61393a57180e40ad2d405e501cfeb5190112e3c352c63";
        }
    }

    public getCandyMachineEvents(): Promise<CandyMachineEvent[]> {
        const moveStruct = this.CoreCandyMachineAddress + "::candy_machine_of_token_data_id::CandyMachineEvents";

        return new Promise<CandyMachineEvent[]>((resolve, reject) => {
            this.client.getAccountResource(this.CoreCandyMachineAddress, moveStruct).then(resource => {
                const results = [] as CandyMachineEvent[];

                Object.keys(resource.data).map(k => {
                    const type: string = k;
                    const data = resource.data as any;
                    const event = data[type];
                    const {counter} = event;

                    results.push({type: k, counter: counter} as CandyMachineEvent)
                })

                resolve(results);
            }).catch((reason: ApiError) => {
                if (reason.errorCode === "resource_not_found") {
                    return resolve([] as CandyMachineEvent[])
                }

                reject(reason);
            });;
        });
    }

    public getCandyMachineAddresses(creator: string): Promise<string[]> {
        const moveStruct = this.CoreCandyMachineAddress + "::candy_machine::CandyMachineOwner";
        const fieldName = "candy_machine_create_events";

        return new Promise((resolve, reject) => {
            this.client.getEventsByEventHandle(creator, moveStruct, fieldName).then(events => {
                const results = events.map(e => e.data.candy_machine_address);
                resolve(results);
            }).catch((reason: ApiError) => {
                if (reason.errorCode === "resource_not_found") {
                    return resolve([] as string[])
                }

                reject(reason);
            });
        });
    }

    public getCandyMachineInfo(candyMachineAddress: string): Promise<CandyMachineInfo | null> {
        return new Promise<CandyMachineInfo | null>((resolve, reject) => {
            const moveStruct = this.CoreCandyMachineAddress + "::candy_machine::CandyMachine<0x1::aptos_coin::AptosCoin, 0x3::token::TokenDataId>"
            this.client.getAccountResource(candyMachineAddress, moveStruct).then(moveResource => {
                const result = moveResource.data as CandyMachineInfo;

                result.address = candyMachineAddress;
                result.state = result?.state !== undefined ? result?.state : CandyMachineState.Unknown;
                result.fixed_sell_price = (result?.sell_price ?? 0) / 100000000;

                const totalCandies: number = result?.candies?.length ?? 0;
                const leftCandies: number = result?.left_amount_of_candy ?? 0;
                result.sold_candies = totalCandies - leftCandies;
                result.percentage_of_sold = (totalCandies === 0) ? 0 : result.sold_candies / totalCandies * 100;

                resolve(result);
            }).catch((reason: ApiError) => {
                if (reason.errorCode === "resource_not_found") {
                    return resolve(null)
                }

                reject(reason);
            });
        });
    }

    public createCandyMachinePayload(request: CreateCandyMachineRequest): EntryFunctionPayload {
        const functionName = this.CoreCandyMachineAddress + "::candy_machine_of_token_data_id::create_candy_machine";
        return {
            type: "entry_function_payload",
            function: functionName,
            arguments: [
                request.seed
            ],
            type_arguments: [],
        } as EntryFunctionPayload;
    }

    public createCollectionPayload(request: CreateCollectionRequest): EntryFunctionPayload {
        const functionName = this.CoreCandyMachineAddress + "::candy_machine_of_token_data_id::create_collection";
        return {
            type: "entry_function_payload",
            function: functionName,
            arguments: [
                request.candyMachineAddress,
                request.name,
                request.description,
                request.url,
                request.size,
                [false, false, false]
            ],
            type_arguments: [],
        } as EntryFunctionPayload;
    }

    public createTokensOfOffChainPayload(request: CreateTokensOfOffChainRequest): EntryFunctionPayload {
        const functionName = this.CoreCandyMachineAddress + "::candy_machine_of_token_data_id::create_tokens_from_base";

        return {
            type: "entry_function_payload",
            function: functionName,
            arguments: [
                request.candyMachineAddress,
                request.collectionName,
                request.tokenBaseName,
                request.tokenCommonDescription,
                request.tokenBaseUri,
                request.tokenBaseUriSuffix,
                request.tokenBaseUriStartIndex,
                request.tokenBaseUriFinishIndex,
                request.royaltyPayeeAddress,
                request.royaltyPointsDenominator,
                request.royaltyPointsNumerator,
            ],
            type_arguments: [],
        } as EntryFunctionPayload;
    }

    public createTokensPayload(requests: CreateTokenRequest[]): EntryFunctionPayload {
        const functionName = this.CoreCandyMachineAddress + "::candy_machine_of_token_data_id::create_tokens_bulk";
        const createTokensArgs = requests.map(request => {
            const keys: string[] = [];
            const values: string[] = [];
            const types: string[] = [];

            for (let property of request.properties) {
                keys.push(property.key);
                values.push(property.value.toString());
                types.push("u8[]");
            }

            return [
                request.collectionName,
                request.name,
                request.description,
                request.maximum,
                request.uri,
                request.royaltyPayeeAddress,
                request.royaltyPointsDenominator,
                request.royaltyPointsNumerator,
                keys,
                values,
                types,
                [false, false, false, false, false]
            ];
        })

        return {
            type: "entry_function_payload",
            function: functionName,
            arguments: [requests[0].candyMachineAddress,
                createTokensArgs.map(t => t[0]),
                createTokensArgs.map(t => t[1]),
                createTokensArgs.map(t => t[2]),
                createTokensArgs.map(t => t[3]),
                createTokensArgs.map(t => t[4]),
                createTokensArgs.map(t => t[5]),
                createTokensArgs.map(t => t[6]),
                createTokensArgs.map(t => t[7]),
                createTokensArgs.map(t => t[8]),
                createTokensArgs.map(t => t[9]),
                createTokensArgs.map(t => t[10]),
                createTokensArgs.map(t => t[11]),
            ],
            type_arguments: [],
        } as EntryFunctionPayload;
    }

    public createTokenPayload(request: CreateTokenRequest): EntryFunctionPayload {
        const functionName = this.CoreCandyMachineAddress + "::candy_machine_of_token_data_id::create_token";

        const keys: string[] = [];
        const values: string[] = [];
        const types: string[] = [];

        for (let property of request.properties) {
            keys.push(property.key);
            values.push(property.value);
            types.push("u8[]");
        }

        return {
            type: "entry_function_payload",
            function: functionName,
            arguments: [
                request.candyMachineAddress,
                request.collectionName,
                request.name,
                request.description,
                request.maximum,
                request.uri,
                request.royaltyPayeeAddress,
                request.royaltyPointsDenominator,
                request.royaltyPointsNumerator,
                keys,
                values,
                types,
                [false, false, false, false, false]
            ],
            type_arguments: [],
        } as EntryFunctionPayload;
    }

    public createStartCandyMachinePayload(request: CreateStartCandyMachineRequest): EntryFunctionPayload {
        const functionName = this.CoreCandyMachineAddress + "::candy_machine_of_token_data_id::start";

        return {
            type: "entry_function_payload",
            function: functionName,
            arguments: [
                request.candyMachineAddress
            ],
            type_arguments: [],
        } as EntryFunctionPayload;
    }

    public createStarMintPayload(request: CreateMintRequest): EntryFunctionPayload {
        const functionName = this.CoreCandyMachineAddress + "::candy_machine_of_token_data_id::mint";

        return {
            type: "entry_function_payload",
            function: functionName,
            arguments: [
                request.candyMachineAddress
            ],
            type_arguments: [],
        } as EntryFunctionPayload;
    }

    public createPauseCandyMachinePayload(request: CreatePauseCandyMachineRequest): EntryFunctionPayload {
        const functionName = this.CoreCandyMachineAddress + "::candy_machine_of_token_data_id::pause";

        return {
            type: "entry_function_payload",
            function: functionName,
            arguments: [
                request.candyMachineAddress
            ],
            type_arguments: [],
        } as EntryFunctionPayload;
    }

    public createResumeCandyMachinePayload(request: CreateResumeCandyMachineRequest): EntryFunctionPayload {
        const functionName = this.CoreCandyMachineAddress + "::candy_machine_of_token_data_id::resume";

        return {
            type: "entry_function_payload",
            function: functionName,
            arguments: [
                request.candyMachineAddress
            ],
            type_arguments: [],
        } as EntryFunctionPayload;
    }

    public createTerminateCandyMachinePayload(request: CreateTerminateCandyMachineRequest): EntryFunctionPayload {
        const functionName = this.CoreCandyMachineAddress + "::candy_machine_of_token_data_id::terminate";

        return {
            type: "entry_function_payload",
            function: functionName,
            arguments: [
                request.candyMachineAddress
            ],
            type_arguments: [],
        } as EntryFunctionPayload;
    }

    public createWithdrawPayload(request: CreateWithdrawRequest): EntryFunctionPayload {
        const functionName = this.CoreCandyMachineAddress + "::candy_machine_of_token_data_id::withdraw";

        return {
            type: "entry_function_payload",
            function: functionName,
            arguments: [
                request.candyMachineAddress
            ],
            type_arguments: [],
        } as EntryFunctionPayload;
    }

    public createUpdateSellPricePayload(request: UpdateSellPriceRequest): EntryFunctionPayload {
        const functionName = this.CoreCandyMachineAddress + "::candy_machine_of_token_data_id::update_sell_price";
        return {
            type: "entry_function_payload",
            function: functionName,
            arguments: [
                request.candyMachineAddress,
                request.newPrice,
            ],
            type_arguments: [],
        } as EntryFunctionPayload;
    }

    public getBalance(candyMachineAddress: string): Promise<number> {
        return new Promise<number>(resolve => {
            const account: AptosAccount = new AptosAccount(undefined, candyMachineAddress);
            this.coinClient.checkBalance(account).then(result => {
                resolve(Number(result) / Number(100000000));
            });
        });
    }
}