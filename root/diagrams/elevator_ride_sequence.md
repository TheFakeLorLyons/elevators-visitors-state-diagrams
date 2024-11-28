sequenceDiagram
    participant V as Visitor
    participant F as Floor
    participant RQ as RequestQueue
    participant EM as ElevatorManager
    participant E as Elevator
    participant C as Controller
    
    Note over V,C: Normal Elevator Request and Ride Sequence
    
    V->>F: Requests Elevator
    F->>RQ: Creates Request
    RQ->>EM: Forwards Request
    
    EM->>E: Checks Elevator Status
    E->>EM: Returns Position/Status
    
    EM->>E: Assigns Request
    E->>C: Movement Command
    
    C->>E: Initiates Movement
    E->>F: Arrives at Floor
    
    F->>V: Signals Elevator Arrival
    V->>E: Enters Elevator
    
    V->>E: Selects Destination
    E->>C: New Movement Command
    C->>E: Controls Movement
    
    E->>F: Arrives at Destination
    V->>F: Exits Elevator
    
    E->>EM: Updates Status
    EM->>RQ: Updates Queue

    Note over V,C: Emergency Scenario Sequence
    
    alt Emergency Detected
        E->>C: Detects Emergency
        C->>EM: Emergency Alert
        EM->>E: Emergency Stop Command
        C->>E: Engages Emergency Brakes
        E->>F: Emergency Protocols
        F->>V: Emergency Instructions
    end