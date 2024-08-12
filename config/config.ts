export interface Config {
    readonly account_id: string;
    readonly region: string;
    readonly vpc_id: string;
    readonly vpc_name: string;
}

export function getConfig(): Config {
    return {
        account_id: "",
        region: "",
        vpc_id: "",
        vpc_name: "",
    };
}
//