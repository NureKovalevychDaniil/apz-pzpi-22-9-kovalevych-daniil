public class FactoryMethodDemo {
    public static void main(String[] args) {
        VehicleFactory factory = new CarFactory();
        Vehicle vehicle = factory.createVehicle();
        vehicle.drive();
    }
}

interface Vehicle {
    void drive();
}

class Car implements Vehicle {
    public void drive() {
        System.out.println("Car is driving");
    }
}

class Truck implements Vehicle {
    public void drive() {
        System.out.println("Truck is driving");
    }
}

abstract class VehicleFactory {
    public abstract Vehicle createVehicle();
}

class CarFactory extends VehicleFactory {
    public Vehicle createVehicle() {
        return new Car();
    }
}