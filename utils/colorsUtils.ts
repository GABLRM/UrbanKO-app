/**
 * Ajoute de l'opacité à une couleur hex
 * @param hex - couleur hex, ex: "#FF0000"
 * @param opacity - opacité de 0 à 1, ex: 0.7 pour 70%
 * @returns couleur hex avec alpha, ex: "#FF0000B3"
 */
export function hexWithOpacity(hex: string, opacity: number): string {
    // Nettoie le #
    const cleanHex = hex.replace('#', '');

    // Si c'est du court (ex: "FFF"), on passe en long "FFFFFF"
    const fullHex =
        cleanHex.length === 3
            ? cleanHex
                  .split('')
                  .map((c) => c + c)
                  .join('')
            : cleanHex;

    // Calcul de l'alpha
    const alpha = Math.round(opacity * 255)
        .toString(16)
        .padStart(2, '0')
        .toUpperCase();

    return `#${fullHex}${alpha}`;
}
