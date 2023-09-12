export declare function deploy(_args: any, { ethers, upgrades }: any): Promise<void>;
export declare function upgrade(args: {
    proxyAddress: string | undefined;
}, { ethers, upgrades }: any): Promise<void>;
export declare function deployOrUpgrade(args: {
    proxyAddress?: string;
}, { ethers, upgrades }: any): Promise<void>;
//# sourceMappingURL=deploy.d.ts.map