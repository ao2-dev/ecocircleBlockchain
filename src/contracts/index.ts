import token from "../../build/contracts/Token.json";
import test from "../../build/contracts/Test.json";

export const Token = {
    abi: token.abi,
    address: token.networks[80001].address,
}

export const Test = {
    abi: test.abi,
    address: test.networks[3].address,
}