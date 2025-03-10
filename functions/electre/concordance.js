export default function concordance(data) {
    let concordance = [];
    let concordanceValue = 0;
    let concordanceResult = 0;

    data.forEach((v, i) => {
        data.forEach((v2, i2) => {
            if (i !== i2) {
                if (v.value > v2.value) {
                    concordanceValue = 1;
                } else {
                    concordanceValue = 0;
                }

                concordance.push({
                    alternative: v.name,
                    alternative2: v2.name,
                    concordanceIndex: concordanceValue
                })
            }
        });
    });

    concordance.forEach((v) => {
        concordanceResult += v.value;
    });

    return {
        result: concordance,
        length: concordance.length
    }
}