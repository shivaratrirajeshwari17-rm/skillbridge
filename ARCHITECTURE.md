# Skill Bridge System Architecture

This document provides a comprehensive technical overview of the system architecture for the Skill Bridge Peer-to-Peer Skill Exchange platform. 

## 1. High-Level MERN Architecture

Skill Bridge follows a standard 4-tier MERN stack architecture designed for horizontal scalability and real-time responsiveness.

```mermaid
graph TD
    subgraph Client Tier
        A[React.js Frontend]
        B[Vite Build Tool]
        C[Context API State]
    end

    subgraph Application Tier
        D[Express.js Server]
        E[Node.js Runtime]
        F[Socket.io WebSocket]
    end

    subgraph Database Tier
        G[(MongoDB Atlas)]
    end

    A <-->|REST API / Axios| D
    A <-->|TCP / WebSockets| F
    D --- E
    F --- E
    E <-->|Mongoose ODM| G
```

## 2. Component Flow & Routing

The frontend utilizes React Router for protected navigation and Axios interceptors for authenticated API requests.

```mermaid
flowchart LR
    User([User]) --> App[App Router]
    
    App --> Auth[AuthRoutes]
    App --> Protected[ProtectedRoutes]
    
    Auth --> Login[Login Page]
    Auth --> Register[Register Page]
    
    Protected -->|Requires JWT| Dash[Dashboard]
    Protected -->|Requires JWT| Matches[Matches]
    Protected -->|Requires JWT| Chat[Real-Time Chat]
    
    Matches --> MatchEngine{Backend Matching Engine}
    Chat --> Socket[Socket.io Server]
```

## 3. Entity-Relationship (ER) Model

The NoSQL database relies on referenced document relationships to ensure data integrity while maintaining high read/write speeds.

```mermaid
erDiagram
    USER ||--o{ SKILL_OFFERED : offers
    USER ||--o{ SKILL_WANTED : desires
    USER ||--o{ TRADE : sends
    USER ||--o{ TRADE : receives
    USER ||--o{ CONVERSATION : participates_in
    CONVERSATION ||--o{ MESSAGE : contains
    
    USER {
        ObjectId _id PK
        String name
        String email
        String password
        String bio
        String role
    }

    SKILL_OFFERED {
        String skillName
        String proficiencyLevel
    }

    SKILL_WANTED {
        String skillName
        String proficiencyLevel
    }

    TRADE {
        ObjectId _id PK
        ObjectId senderId FK
        ObjectId receiverId FK
        String status
        Date createdAt
    }

    CONVERSATION {
        ObjectId _id PK
        Array participants FK
        Object lastMessage
    }

    MESSAGE {
        ObjectId _id PK
        ObjectId conversationId FK
        ObjectId senderId FK
        String text
        Date createdAt
    }
```

## 4. Intelligent Matching Algorithm Flow

The core backend algorithm processes user data to calculate bilateral compatibility scores.

```mermaid
sequenceDiagram
    participant Client
    participant API as Express Router
    participant Engine as Matching Controller
    participant DB as MongoDB

    Client->>API: GET /api/match (with JWT)
    API->>Engine: getMatches(req.user.id)
    Engine->>DB: findById(currentUser)
    DB-->>Engine: Returns User A Profile
    Engine->>DB: find({ _id: $ne: currentUser._id })
    DB-->>Engine: Returns All Other Users
    
    note over Engine: Loop through current user skills
    Engine->>Engine: Verify if Perfect Matches Exist
    alt No Perfect Match Exists
        Engine->>DB: Dynamically Provision Mock Peer
    end
    
    note over Engine: Calculate Match Score
    Engine->>Engine: iCanTeachThem + theyCanTeachMe
    
    Engine->>Engine: Filter scores > 0 & Sort DESC
    Engine-->>API: Array of Match Objects
    API-->>Client: 200 OK (JSON)
```

## 5. Security & Authentication Flow

```mermaid
graph TD
    A[Client Submits Credentials] -->|POST /auth/login| B(Express Router)
    B --> C{Verify Password}
    C -->|bcrypt.compare| D[(MongoDB User Document)]
    D -->|Match Found| E[Sign JWT Token]
    E -->|Response 200| F[Client LocalStorage]
    
    F -->|Subsequent Requests| G[Axios Interceptor]
    G -->|Attach Bearer Token| H[Protected Route]
    H -->|Auth Middleware| I{Verify Token}
    I -->|Valid| J[Process Request]
    I -->|Invalid| K[401 Unauthorized]
```
