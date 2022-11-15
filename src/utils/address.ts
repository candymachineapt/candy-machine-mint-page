export interface IAddressOperation {
    mask(address: string | null | undefined): string;
}

class AddressOperation implements IAddressOperation {
    mask(address: string): string {
        if (address == null) return "";
        return address.slice(0, 4) + "..." + address.slice(address.length - 4);
    }
}

const defaultImplementation: IAddressOperation = new AddressOperation();

export default defaultImplementation as IAddressOperation;