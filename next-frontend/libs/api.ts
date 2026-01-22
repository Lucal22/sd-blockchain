// Define the API URL based on the server port
// When running in Docker, use the container names
// When running locally, use localhost
const API_PORT = process.env.NEXT_PUBLIC_API_PORT || 5000;

// Detect if running in Docker by checking if localhost can be reached
// For Docker: http://server1:5000, http://server2:5000, http://server3:5000
// For local: http://localhost:5000, http://localhost:5001, http://localhost:5002

// Map port to server name for Docker
const getServerName = (port: string | number): string => {
  const portNum = parseInt(String(port));
  switch (portNum) {
    case 5000:
      return "server1";
    case 5001:
      return "server2";
    case 5002:
      return "server3";
    default:
      return "server1";
  }
};

// Try to use Docker network names, fall back to localhost
const API_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? `http://localhost:${API_PORT}`
    : `http://${getServerName(API_PORT)}:${API_PORT}`;

export interface Transaction {
  sender: string;
  recipient: string;
  amount: number;
}

export interface Block {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  proof: number;
  previous_hash: string | number;
}

export interface ChainResponse {
  chain: Block[];
  length: number;
}

export interface TransactionResponse {
  message: string;
  index: number;
  transactions: Transaction[];
  proof: number;
  previous_hash: string | number;
}

// Create a new transaction
export async function createTransaction(
  transaction: Transaction,
): Promise<TransactionResponse> {
  try {
    const response = await fetch(`${API_URL}/transactions/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    });

    if (!response.ok) {
      throw new Error(`Error creating transaction: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to create transaction:", error);
    throw error;
  }
}

// Get the blockchain
export async function getChain(): Promise<ChainResponse> {
  try {
    const response = await fetch(`${API_URL}/chain`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching chain: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch chain:", error);
    throw error;
  }
}
