// Function to calculate criteria weights using AHP method
const calculateCriteriaWeights = (kriteria_1, nilai, kriteria_2) => {
    // Definisi matriks perbandingan berpasangan
    const comparisonMatrix = [
        [1, nilai, 1 / nilai],
        [1 / nilai, 1, nilai],
        [nilai, 1 / nilai, 1]
    ];

    // Langkah-langkah metode AHP
    // 1. Normalisasi matriks perbandingan
    const n = comparisonMatrix.length;
    const normalizedMatrix = comparisonMatrix.map(row =>
        row.map(element => element / row.reduce((acc, val) => acc + val, 0))
    );

    // 2. Hitung nilai rata-rata setiap kolom
    const sumOfColumns = Array(n).fill(0);
    normalizedMatrix.forEach(row =>
        row.forEach((element, index) => (sumOfColumns[index] += element))
    );

    // 3. Hitung vektor eigen
    const eigenvector = sumOfColumns.map(sum => sum / n);

    // 4. Hitung eigenvalue
    const lambdaMax = eigenvector.reduce((acc, val, index) => acc + val * sumOfColumns[index], 0);

    // 5. Hitung konsistensi index (CI) dan konsistensi rasio (CR)
    const CI = (lambdaMax - n) / (n - 1);
    const RI = [0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];
    const CR = CI / RI[n - 1];

    // 6. Cek konsistensi
    if (CR > 0.1) {
        console.log("Matriks perbandingan tidak konsisten, ulangi proses");
        return null;
    }

    // 7. Hitung bobot kriteria
    const weights = eigenvector.map(val => val / lambdaMax);

    // Return criteria weights
    return weights;
};

// Contoh penggunaan
const kriteria_1 = 'Kriteria A';
const nilai = 3; // Misalnya, nilai perbandingan antara kriteria_1 dan kriteria_2 adalah 3
const kriteria_2 = 'Kriteria B';

const criteriaWeights = calculateCriteriaWeights(kriteria_1, nilai, kriteria_2);
console.log('Criteria weights:', criteriaWeights);
