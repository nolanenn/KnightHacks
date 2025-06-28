import java.util.Random;
import java.util.Scanner;

public class DungeonCrawler {

    private static final int MAP_SIZE = 10;
    private static char[][] map = new char[MAP_SIZE][MAP_SIZE];
    private static int playerX, playerY;
    private static Random random = new Random();

    public static void main(String[] args) {
        initializeGame();
        gameLoop();
    }

    private static void initializeGame() {
        // Initialize the map with empty spaces and place the player
        for (int i = 0; i < MAP_SIZE; i++) {
            for (int j = 0; j < MAP_SIZE; j++) {
                map[i][j] = '.';
            }
        }
        playerX = random.nextInt(MAP_SIZE);
        playerY = random.nextInt(MAP_SIZE);
        map[playerY][playerX] = 'P'; // 'P' represents the player
    }

    private static void gameLoop() {
        Scanner scanner = new Scanner(System.in);
        boolean gameOver = false;

        while (!gameOver) {
            printMap();
            System.out.println("Enter your move (W/A/S/D or Q to quit): ");
            String input = scanner.nextLine().toUpperCase();

            switch (input) {
                case "W":
                    movePlayer(0, -1);
                    break;
                case "S":
                    movePlayer(0, 1);
                    break;
                case "A":
                    movePlayer(-1, 0);
                    break;
                case "D":
                    movePlayer(1, 0);
                    break;
                case "Q":
                    gameOver = true;
                    break;
                default:
                    System.out.println("Invalid move!");
            }

            // Basic game logic - check if player is still on the map
            if (playerX < 0 || playerX >= MAP_SIZE || playerY < 0 || playerY >= MAP_SIZE) {
                gameOver = true;
                System.out.println("You fell off the map! Game Over.");
            }
        }

        scanner.close();
        System.out.println("Thanks for playing!");
    }

    private static void movePlayer(int dx, int dy) {
        // Clear the player's previous position
        map[playerY][playerX] = '.';

        // Update player position
        playerX += dx;
        playerY += dy;

        // Place the player at the new position (if valid)
        if (playerX >= 0 && playerX < MAP_SIZE && playerY >= 0 && playerY < MAP_SIZE) {
            map[playerY][playerX] = 'P';
        }
    }

    private static void printMap() {
        for (int i = 0; i < MAP_SIZE; i++) {
            for (int j = 0; j < MAP_SIZE; j++) {
                System.out.print(map[i][j] + " ");
            }
            System.out.println();
        }
    }
}
