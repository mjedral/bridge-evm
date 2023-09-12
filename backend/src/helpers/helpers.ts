import * as fs from "fs";
import * as path from "path"

export const getAbiFromJsonFile = (abiPath: string) => {
    return JSON.parse(fs.readFileSync(path.resolve(__dirname, abiPath)).toString()).abi;
}