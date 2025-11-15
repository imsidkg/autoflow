import {useQueryStates} from "nuqs"
import { credentialsParams } from "../params"

export const useCredentialParams = () => {
    return useQueryStates(credentialsParams)
}