export const difficultyToScore = (difficulty?: string) => {
    switch (difficulty) {
        case "easy":
            return 10;
        case "medium":
            return 20;
        case "hard":
            return 30;
        default:
            return 15;
    }
};
