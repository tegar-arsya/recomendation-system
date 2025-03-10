export default function normalization(data) {
    // Step 1: Extract the values for each criterion
    const akreditasiValues = data.map(item => item.akreditasi);
    const fasilitasValues = data.map(item => item.fasilitas);
    const jarakValues = data.map(item => item.jarak);

    // Step 2: Sum the values in each column
    const sumAkreditasi = akreditasiValues.reduce((acc, value) => acc + value, 0);
    const sumFasilitas = fasilitasValues.reduce((acc, value) => acc + value, 0);
    const sumJarak = jarakValues.reduce((acc, value) => acc + value, 0);

    // Step 3: Normalize each school's value
    const normalizedValues = data.map(item => {
        return {
            id: item.id,
            name: item.name,
            akreditasiNormalized: item.akreditasi / sumAkreditasi,
            fasilitasNormalized: item.fasilitas / sumFasilitas,
            jarakNormalized: item.jarak / sumJarak
        };
    });

    // Step 4: Calculate the average of the normalized values for each criterion
    const averageAkreditasi = normalizedValues.reduce((acc, item) => acc + item.akreditasiNormalized, 0) / data.length;
    const averageFasilitas = normalizedValues.reduce((acc, item) => acc + item.fasilitasNormalized, 0) / data.length;
    const averageJarak = normalizedValues.reduce((acc, item) => acc + item.jarakNormalized, 0) / data.length;

    return {
        normalizedValues: normalizedValues,
        averages: {
            akreditasi: averageAkreditasi,
            fasilitas: averageFasilitas,
            jarak: averageJarak
        }
    };
}