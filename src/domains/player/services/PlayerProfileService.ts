/***********************************************
 * FILE: src/domains/player/services/PlayerProfileService.ts
 * CREATED: 2025-03-23 18:34:19
 *
 * PURPOSE:
 * Manages player profile data and progression, including AW score updates
 *
 * METHODS:
 * - updateAWScore(): Updates the player's Atomic Weight score
 * - getCurrentAWScore(): Gets the current AW score
 *****************/

export class PlayerProfileService {
  private awScore: number = 0;

  /**
   * Updates the player's Atomic Weight (AW) score by adding the provided points
   * @param points - The number of AW points to add
   * @returns Promise resolving to the new total score
   */
  public async updateAWScore(points: number): Promise<number> {
    this.awScore += points;
    return this.awScore;
  }

  /**
   * Gets the current Atomic Weight (AW) score
   * @returns The current AW score
   */
  public getCurrentAWScore(): number {
    return this.awScore;
  }
}
