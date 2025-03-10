import normalization from "./normalization.js"

export default function saw(globalScore){
    return {
        result: normalization(globalScore)
    }
}