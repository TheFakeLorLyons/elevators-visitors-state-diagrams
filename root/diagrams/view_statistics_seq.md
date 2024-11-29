sequenceDiagram
    participant GUI
    participant Statistics
    participant IO
    participant Simulation

    GUI->>+Statistics: requestStatistics()
    Statistics->>+Simulation: gatherSimulationData()
    Simulation-->>-Statistics: returnSimulationData
    Statistics->>Statistics: processStatistics()
    Statistics->>+IO: writeStatisticsReport()
    IO-->>-Statistics: confirmWriteComplete
    Statistics-->>-GUI: displayStatistics()