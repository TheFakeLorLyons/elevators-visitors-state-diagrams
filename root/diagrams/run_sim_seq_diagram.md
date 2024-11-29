sequenceDiagram
    participant GUI as GUI
    participant Config as Configuration
    participant Simulation as Simulation
    participant IO as IO
    participant Building as Building
    participant ElevatorManager as ElevatorManager
    participant Time as Timer
    participant Visitors as Visitors
    participant Statistics as Statistics
    participant Elevator as Elevator
   
    #Initialization Phase
    #Configuration Initialization
    Note over GUI,Simulation: Initializing Configurations
    Simulation->>+GUI: getConfigs()
    GUI->>+Config: loadConfiguration()
    alt User Configuration Exists
        Config->>+Simulation: applyUserConfig()
        Simulation-->>-Config: applied
    else
        Config->>+Simulation: applyDefaultConfig()
        Simulation-->>-Config: applied
    end
    Config -->>-GUI: configurationsLoaded  
    GUI-->>+Simulation: configsLoaded?
    
    #Scenario Initialization
    Note over Simulation,IO: Initializing Scenario
    Simulation->>+IO: getScenario()
    alt User Scenario Exists
        IO->>+Simulation: loadUserScenario()
        Simulation-->>-IO: scenarioLoaded
    else
        IO->>+Simulation: loadScenario()
        Simulation->>+Simulation: generateDefaultScenario()
        Simulation-->>-IO: scenarioLoaded
    end
    IO-->>-Simulation: scenarioLoaded?

    #Simulation Initialization
    Note over Simulation,Elevator: Initializing Simulation
    Simulation->>+Building: createBuilding()
    Building-->>-Simulation: buldingCreated

    Simulation->>+Building: applyFloorRestrictions()
    Building-->>-Simulation: restrictionsApplied

    Simulation->>+ElevatorManager: generateElevatorManager()
    ElevatorManager->>+Elevator: populateElevators()
    Elevator-->>-ElevatorManager: elevatorsPopulated
    ElevatorManager-->>-Simulation: elevatorsPopulated

    Simulation->>+Visitors: prepareVisitorPool()
    Visitors-->>-Simulation: returnPreparedVisitors()
    
    #Timer and Global Setup
    Simulation->>+Time: initialize(scenarioParameters)
    Time-->>-Simulation: simulationTimeInitialized
    ElevatorManager->>+Time: synchronize()
    Time-->>-ElevatorManager: elevatorsSynchronized
    
    Simulation->>+Statistics: initializeMetrics()
    Statistics-->>-Simulation: ready
    
    #Visualization Preparation
    Note over Simulation,Elevator: Simulation Running/Main Loop 
   
   Simulation->>+Time: begin()
    #Simulation Run Sequence
    loop Simulation Running
        Time-->>-Simulation: tick()
        
        par Process Visitors
            Simulation->>+Visitors: updateState()
            alt Visitor Requesting Elevator
                Visitors->>+ElevatorManager: requestElevator()
                ElevatorManager->>+Elevator: assignRequest()
                Elevator-->>-ElevatorManager: assignRequest()
                ElevatorManager-->>-Visitors: confirmAssignment()
            else Visitor In Transit
                Visitors->>+Statistics: recordTravelTime()
                Statistics-->>-Visitors: recorded
            end
            Visitors-->>-Simulation: processed
       
        and Process Elevators
            Simulation->>+ElevatorManager: processRequests()
            loop For Each Active Elevator
                ElevatorManager->>+Elevator: checkStatus()
                alt Has Requests&isAvailable
                    Elevator->>Elevator: move()
                    Elevator->>-Visitors: updatePassengers()
                else Emergency Condition
                    Elevator->>ElevatorManager: signalEmergency()
                    ElevatorManager-->Simulation: emergency()
                    Simulation->>+IO: logEmergency()
                    IO-->>-Simulation: logged
                    Simulation->>+GUI: displayEmergencyAlert()
                    GUI-->>-Simulation: warningClosed
                else Maintenance Required
                    ElevatorManager->>+Elevator: enterMaintenance()
                    Elevator-->>-ElevatorManager: maintenanceOver?
                end
                ElevatorManager-->>-Simulation:processed
            end
        Simulation->>+Statistics: collectMetrics()
        and Update Statistics
            Statistics->>+Statistics: updateWaitTimes()
            Statistics->>-Statistics: logEvents()
        end
        Statistics-->>-Simulation: statisticsCollected
        
        #Termination Check
        Simulation->>+IO: checkTerminationConditions()
        IO->>-Simulation: readyToTerminate?
    end
    
    #Simulation Conclusion
    Note over Simulation,Elevator: Simulation Exiting
    Simulation->>+Time: stopRecording()
    Time-->>-Simulation: simulationOver
    Simulation->>+Statistics: generateFinalReport()
    Statistics->>-Simulation: reportGenerated
    Simulation->>+IO: saveSimulationResults()
    IO->>-Simulation: resultsSaved
    Simulation->>-GUI: endSimulation()