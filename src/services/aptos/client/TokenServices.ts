import { AptosClient, HexString } from "aptos";
import {AptosCollection, AptosTokenData} from "./AptosTypes";

export class TokenService {
    private client: AptosClient;

    constructor(client: AptosClient) {
        this.client = client;
    }

    public getCollections(candyMachineAddresss: string): Promise<AptosCollection[]> {
        const moveStruct = "0x3::token::Collections";
        const fieldName = "create_collection_events";

        return new Promise((resolve) => {
            this.client.getEventsByEventHandle(candyMachineAddresss, moveStruct, fieldName).then(events => {
                const results = events.map(e => e.data as AptosCollection);
                resolve(results);
            });
        });
    }

    public getTokenDatas(candyMachineAddresss: string): Promise<AptosTokenData[]> {
        const moveStruct = "0x3::token::Collections";
        const fieldName = "create_token_data_events";

        return new Promise((resolve) => {
            this.client.getEventsByEventHandle(candyMachineAddresss, moveStruct, fieldName).then(events => {
                const results = events.map(e => {
                    const result = e.data as AptosTokenData;
                    result.property_values.forEach((value, index, array) => {
                        const hexString = new HexString(value);
                        const uint8array = hexString.toUint8Array();
                        array[index] = new TextDecoder().decode(uint8array);
                    });

                    return result;
                });
                resolve(results);
            });
        });
    }
}