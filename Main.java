public class Main {
    public static int hello() {
        System.out.println("Hello World");
        int balls = 1;
        return balls;
    }
    
    public static void main(String[] args){
        int ballNum = hello();
        //hoy
        int x = 20;
        System.out.println(x - ballNum); // 20 - 1, prints 19
    }
}
