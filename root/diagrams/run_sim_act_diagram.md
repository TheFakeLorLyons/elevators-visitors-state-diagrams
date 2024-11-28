stateDiagram-v2
    [*] --> LoadConfiguration
    state LoadConfiguration {
        [*] --> CheckUserConfig
        CheckUserConfig --> UseDefaultConfig : No user config
        CheckUserConfig --> UseUserConfig : User config exists
        UseDefaultConfig --> ConfigurationReady
        UseUserConfig --> ConfigurationReady
    }

    state LoadScenario {
        [*] --> CheckUserScenario
        CheckUserScenario --> UseDefaultScenario : No user scenario
        CheckUserScenario --> UseUserScenario : User scenario exists
        UseDefaultScenario --> ScenarioReady
        UseUserScenario --> ScenarioReady
    }
    LoadConfiguration --> LoadScenario
    
    state SimulationLoop {
        state ParallelProcessing {
            state "Visitor Processing" as visitors {
                ProcessVisitors --> CheckRequests: For each visitor
                CheckRequests --> UpdateState: Process requests
                UpdateState --> ProcessVisitors: Next visitor
            }
            state "Elevator Operations" as elevators {
                CheckElevators --> HandleRequests: For each elevator
                HandleRequests --> UpdatePosition: Process movement
                UpdatePosition --> CheckElevators: Next elevator
            }
            state "Statistics Collection" as stats {
                CollectData --> UpdateStats: Record metrics
                UpdateStats --> LogEvents: Update statistics
                LogEvents --> CollectData: Continue monitoring
            }
        }
        
        state EmergencyAndMaintenanceHandling {
            [*] --> MonitorEmergencies
            [*] --> ScheduleMaintenance
            MonitorEmergencies --> HandleEmergency
            ScheduleMaintenance --> PerformMaintenance
        }
    }
    LoadScenario --> SimulationLoop
        
    SimulationLoop --> CheckTerminationConditions
    CheckTerminationConditions --> SimulationLoop : Continue
    CheckTerminationConditions --> StopSimulation : Terminate

    RunSimulation --> EmergencyAndMaintenanceHandling
    
    EmergencyAndMaintenanceHandling --> RunSimulation
    EmergencyAndMaintenanceHandling --> [*]
    RunSimulation --> [*]