export interface IHexOperation {
    toString(hex: string | undefined): string;

    parse(text: string): string;
}

class HexOperation implements IHexOperation {
    toString(hex: string | undefined): string {
        if (hex === undefined) {
            return "";
        }

        return decodeURIComponent(
            hex.replace(/\s+/g, '') // remove spaces
                .replace(/[0-9a-f]{2}/g, '%$&') // add '%' before each 2 characters
        );
    }

    parse(text: string): string {
        const encoder = new TextEncoder();
        const encoded = encoder.encode(text);
        return Array.from(encoded, (i) => i.toString(16).padStart(2, "0")).join("");
    }
}

const defaultImplementation: IHexOperation = new HexOperation();

export default defaultImplementation as IHexOperation;