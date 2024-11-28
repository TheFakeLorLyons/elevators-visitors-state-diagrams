sequenceDiagram
    participant V as Visitor
    participant F as Floor
    participant RQ as RequestQueue
    participant EM as ElevatorManager
    participant E as Elevator
    participant Stats as Statistics

    alt Normal Operations
        alt Handle Request
            V->>+EM: Requests Elevator

            par Elevator Determination
                EM->>+E: Checks Elevator Status
            and Floor Eligibility
                EM->>+F: Check Floor Capacity&Access Level
                F->>F: getAccessLevel&Capacity()
                F-->>-EM: returnEligible?
            end

            alt Elevator Available
                E-->>-EM: Returns Position/Status
                EM->>+RQ: Creates Request
                RQ->>+E: Assigns Request
                E->>E: Movement Initiated
                E-->>-RQ: Arrived
                RQ-->>-EM: Request Complete
            else Elevator Not Available
                E-->>EM: Returns "Unavailable"
                EM->>+RQ: Returns "Unavailable"
                RQ->>+E: Forwards Request
                loop Retry Until Available
                    E-->>-RQ: Returns "Unavailable"
                    RQ->>+E: Resubmits Request
                end
            end
        else Not Authorized/Authenticated
            EM->>V: Null/Exception Message
        else Visitor Leaves Before Elevator Arrival
            V->>RQ: Visitor Takes Stairs/Leaves           
        end

        EM-->>+V: signalWait()
        par Process Visitors
            V->>+E: Waiting

            E-->>-V: Elevator Arrives
            F->>V: Signals Elevator Arrival
            V->>E: Enters Elevator
            
            V->>+E: Selects Destination
            E->>E: move()
            E->F: Arrives at Destination
            E-->>-V: Arrived!
            V-->>+E: Exits Elevator
            V->>F: Go to Floor Destination
        and Visitor In Transit
     
            V->>V: Waiting
            V->>Stats: recordTravelTime()
            V-->>-E: Arrives at Destination

        
        and Process Elevators
            loop For Each Active Elevator
                EM->>+E: checkStatus()
                alt Has Current Request(s)
                    E->>E: move()
                    E->>V: updatePassengers()
                else Elevator Available
                    E->>RQ: setAvailable()
                end
            end
            E-->>-EM: Arrives at Destination
        
        and Update Statistics
            EM->>+Stats: updateWaitTimes()
            Stats->>Stats: logEvents()
            Stats-->>-EM: return
        end
        EM-->>-V: Waiting For Another Request
        
        else Emergency
        Note over V,Stats: Emergency Scenario Sequence
        alt Emergency Detected
            E->>+RQ: Detects Emergency
            E->E: emergencyProtocol()
            RQ->>+EM: Emergency Stop Command()
            EM->>B: Emergency Protocols()
            F->>V: Emergency Instructions
            EM->>Stats: Report Emergency Statistics
            loop For Each Elevator
                EM->>+E: checkEmergencyStatus()
                alt Emergency is Over
                    E->E: updateStatus(emergencyOver)
                    E-->>-EM: Emergency is Over
                else Emergency Still Occuring
                    E-->>-EM: Continue Waiting
                end
            end
        end
    end