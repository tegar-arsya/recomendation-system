import normalization from "./normalization.js"
import concordance from './concordance.js'
import discordance from "./discordance.js"

export default function electre(globalScore){
    const globalNormalization = normalization(globalScore)
    const concordanceResult = concordance(globalNormalization)
    const discordanceResult = discordance(globalNormalization)
    return {
        "WNormalization": globalNormalization,
        "concordance": concordanceResult,
        "discordance": discordanceResult
    }
}