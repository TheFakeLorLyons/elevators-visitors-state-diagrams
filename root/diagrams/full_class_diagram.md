classDiagram
    class Visitor {
        -visitor_id: int
        -name: string
        -destination_list: vector~Floor~
        -visitor_status: enum~Status~
        -access_level: int
        -visitStartTime: datetime
        +updateStatus(status)
        +handleEmergency()
        +addDestination(Floor)
        +getAccessLevel(): int
        +getVisitDuration(): int
    }
    
    class PassengersList {
        -global_passengers: vector~Passenger~
        -activePassengers: int
        -totalServed: int
        +getAllPassengers()
        +addPassenger(Passenger)
        +removePassenger(Passenger)
        +getStatistics(): PassengerStats
        +filterByStatus(Status): vector~Passenger~
    }
    
    class Passenger {
        -visitor_fk: int
        -current_floor: Floor
        -time_waiting: int
        -priority: int
        -destination_floor: Floor
        -status: enum~PassengerStatus~
        +requestElevator()
        +recordBoardingTime()
        +exitQueueEarly()
        +updateWaitingTime()
        +getPriority(): int
    }
    
    class Floor {
        -floor_id: int
        -floor_number: int
        -department: enum~Departments~
        -access_level: int
        -capacity: int
        -current_occupancy: int
        -waiting_area: WaitingArea
        +getAccessLevel(): string
        +addToWaitingArea(Passenger)
        +removeFromWaitingArea(Passenger)
        +isAtCapacity(): boolean
        +getOccupancyStatus(): Status
    }
    
    class Elevator {
        -elevator_id: int
        -capacity: int
        -destination: int
        -current_num_passengers: int
        -passenger_list: vector~Passenger~
        -current_requests: vector~Request~
        -status: enum~ElevatorStatus~
        -direction: enum~Direction~
        -maintenance_status: enum~MaintenanceStatus~
        +move(destination)
        +addPassenger(Passenger)
        +removePassenger(Passenger)
        +emergencyStop()
        +calculateNextStop(): Floor
        +needsMaintenance(): boolean
    }
    
    class ElevatorManager {
        -active_requests: RequestQueue
        -waiting_list: vector~Passenger~
        -sysTimer: Timer
        -elevators: vector~Elevator~
        -maintenance_schedule: MaintenanceSchedule
        +calculateOptimalDistribution()
        +assignRequest(Request)
        +handleEmergency()
        +optimizeRoutes()
        +scheduleMaintenance()
        +getPerformanceMetrics(): Metrics
    }
    
    class RequestQueue {
        -requestMap: Map~Elevator, vector~Request~~
        -priorityQueue: PriorityQueue~Request~
        +addRequest(Request)
        +getNextRequest(): Request
        +reorderQueue()
        +removeCancelledRequests()
        +getPriorityRequests(): vector~Request~
    }
    
    class Request {
        -request_id: int
        -passenger_fk: int
        -source_floor: Floor
        -destination_floor: Floor
        -priority: int
        -timestamp: datetime
        -status: enum~RequestStatus~
        +updateStatus(RequestStatus)
        +calculatePriority(): int
        +isExpired(): boolean
    }
    
    class GUI {
        -current_view: string
        -configuration: Configuration
        -theme: Theme
        -activeAlerts: vector~Alert~
        +update()
        +showStatistics()
        +displayMenu()
        +updateRealTimeData()
        +showAlerts()
        +switchView(string)
    }
    
    class Simulation {
        -statistics: SimulationStatistics
        -current_file: File
        -scenario: SimulationScenario
        -speed: float
        +loadFile(File)
        +saveFile(File)
        +adjustSpeed(float)
        +pauseSimulation()
        +generateReport()
        +runScenario(SimulationScenario)
    }
    
    class Timer {
        -start_time: datetime
        -events: map~string, datetime~
        -interval: int
        -paused: boolean
        +scheduleEvent(var name, int interval)
        +trackWaitTime(Visitor visitor)
        +setDoorHoldTime(int seconds)
        +measurePerformance()
        +pause()
        +resume()
    }

    Visitor <|-- Passenger
    PassengersList --> Passenger
    Building *-- Floor
    Building *-- ElevatorManager
    ElevatorManager *-- Timer
    ElevatorManager *-- RequestQueue
    ElevatorManager o-- "1..*" Elevator
    Floor --> RequestQueue
    Elevator --> Request
    RequestQueue *-- Request
    GUI --> Simulation
    Simulation --> Building
    Simulation ..> IO
    GUI o-- Configuration