sequenceDiagram
    participant GUI
    participant Config
    participant IO
    participant Simulation
    participant Building
    participant ElevatorManager
    participant Visitors
    participant Time

    alt Create New Scenario
        GUI->>+Config: initializeScenarioConfiguration()
        Config->>+Building: configureBuilding(parameters)
        Building-->>-Config: submitted

        Config->>+ElevatorManager: configureElevators(specifications)
        ElevatorManager-->>-Config: return elevatorList

        Config->>+Visitors: configureVisitorPool(settings)
        Visitors-->>-Config: return visitorList

        Config->>+Time: setupSimulationTimer(duration)
        Time-->>-Config: setupComplete
        
        GUI->>+Simulation: createNewScenario(configData)

        Simulation->>Building: instantiateBuilding()
        Simulation->>ElevatorManager: setupElevatorSystem()
        Simulation->>Visitors: generateInitialVisitorPopulation()
        Simulation->>Time: startSimulationTimer()

        Simulation-->>GUI: scenarioReady
    else Edit Existing Scenario
        Simulation->>+IO: loadExistingScenario()
        IO-->>-Simulation: currentScenarioData

        Simulation->>+GUI: loadExistingScenario()
        GUI-->>-Config: modifyScenarioConfiguration()
        Config->>+Building: updateBuildingParameters()
        Building-->>-Config: submitted

        Config->>+ElevatorManager: reconfigureElevators()
        ElevatorManager-->>-Config: return elevatorList

        Config->>+Visitors: adjustVisitorPoolSettings()
        Visitors-->>-Config: return visitorList
        Config->>+Time: modifySimulationTimer()

        Time-->>-Config: setupComplete

        GUI->>+Simulation: updateScenario(modifiedConfigData)

        Simulation->>Building: applyBuildingChanges()
        Simulation->>ElevatorManager: updateElevatorConfiguration()
        Simulation->>Visitors: regenerateVisitorPopulation()
        Simulation->>Time: resetSimulationTimer()

        Simulation-->>GUI: scenarioUpdated
    end
