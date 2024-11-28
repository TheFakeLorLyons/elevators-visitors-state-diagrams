sequenceDiagram
    participant MC as MaintenanceCrew
    participant EM as ElevatorManager
    participant E as Elevator
    participant C as Controller
    participant IO as IOSystem
    
    Note over MC,IO: Scheduled Maintenance Sequence
    
    MC->>EM: Initialize Maintenance Mode
    EM->>E: Suspend Normal Operation
    E->>C: Complete Current Journey
    C->>E: Park at Maintenance Floor
    
    activate MC
    MC->>E: Perform Diagnostics
    E->>IO: Log Diagnostic Results
    
    MC->>E: Perform Maintenance
    E->>IO: Log Maintenance Actions
    
    MC->>E: Run Test Sequence
    E->>C: Test Commands
    C->>E: Execute Tests
    E->>IO: Log Test Results
    deactivate MC
    
    MC->>EM: Maintenance Complete
    EM->>E: Resume Normal Operation
    E->>IO: Final Status Update
    
    opt Failed Tests
        E->>EM: Report Issues
        EM->>MC: Request Additional Service
        MC->>E: Additional Maintenance
    end
```