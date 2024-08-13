export interface Config {
    readonly account_id: string;
    readonly region: string;
    readonly vpc_id: string;
    readonly vpc_name: string;
}

export function getConfig(): Config {
    return {
        account_id: "386636587776",
        region: "eu-central-1",
        vpc_id: "vpc-0d78a8b731a23f55a",
        vpc_name: "career-sandbox",
    };
}
//