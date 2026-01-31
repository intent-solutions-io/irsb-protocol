// src/types.ts
var X402_PAYLOAD_VERSION = "1.0.0";
var PrivacyLevel = /* @__PURE__ */ ((PrivacyLevel2) => {
  PrivacyLevel2[PrivacyLevel2["Public"] = 0] = "Public";
  PrivacyLevel2[PrivacyLevel2["SemiPublic"] = 1] = "SemiPublic";
  PrivacyLevel2[PrivacyLevel2["Private"] = 2] = "Private";
  return PrivacyLevel2;
})(PrivacyLevel || {});
var X402Mode = /* @__PURE__ */ ((X402Mode2) => {
  X402Mode2["Micropayment"] = "micropayment";
  X402Mode2["Commerce"] = "commerce";
  return X402Mode2;
})(X402Mode || {});

// src/schema.ts
import { keccak256, toUtf8Bytes, solidityPacked } from "ethers";
function sortObjectKeys(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }
  const sorted = {};
  for (const key of Object.keys(obj).sort()) {
    sorted[key] = sortObjectKeys(obj[key]);
  }
  return sorted;
}
function canonicalize(payload) {
  const sorted = sortObjectKeys(payload);
  return JSON.stringify(sorted);
}
function computePayloadCommitment(payload) {
  const canonical = canonicalize(payload);
  return keccak256(toUtf8Bytes(canonical));
}
function computeRequestFingerprint(method, path, body, timestamp) {
  const bodyHash = keccak256(toUtf8Bytes(body || ""));
  return keccak256(
    solidityPacked(
      ["string", "string", "bytes32", "uint256"],
      [method, path, bodyHash, timestamp]
    )
  );
}
function computeTermsHash(payment, expiry) {
  return keccak256(
    solidityPacked(
      ["string", "string", "uint256", "uint256"],
      [payment.asset, payment.amount, payment.chainId, expiry]
    )
  );
}
function computeIntentHash(service, requestId) {
  return keccak256(
    solidityPacked(
      ["string", "string"],
      [service.serviceId, requestId]
    )
  );
}
function computeRouteHash(service) {
  return keccak256(
    solidityPacked(
      ["string", "string"],
      [service.domain, service.endpoint]
    )
  );
}
function computeEvidenceHash(paymentRef) {
  return keccak256(toUtf8Bytes(paymentRef));
}
function isValidCID(cid) {
  if (!cid || cid.length > 64) {
    return false;
  }
  const cidPattern = /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[a-z2-7]{58,})$/;
  return cidPattern.test(cid);
}
function formatCiphertextPointer(cid) {
  if (isValidCID(cid)) {
    return `ipfs://${cid}`;
  }
  return cid;
}
function verifyCommitment(commitment, payload) {
  const computed = computePayloadCommitment(payload);
  return computed.toLowerCase() === commitment.toLowerCase();
}
function generateNonce() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return "0x" + Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function createPayload(params) {
  const now = Math.floor(Date.now() / 1e3);
  const defaultExpiry = now + 3600;
  return {
    version: X402_PAYLOAD_VERSION,
    service: params.service,
    payment: params.payment,
    request: {
      requestId: params.request.requestId,
      requestFingerprint: params.request.requestFingerprint || computeRequestFingerprint("POST", "/", "", now)
    },
    response: params.response,
    timing: {
      issuedAt: params.timing?.issuedAt ?? now,
      expiry: params.timing?.expiry ?? defaultExpiry,
      nonce: params.timing?.nonce ?? generateNonce()
    }
  };
}

// src/receipt.ts
import { ZeroHash, keccak256 as keccak2562, solidityPacked as solidityPacked2 } from "ethers";
var RECEIPT_V2_TYPES = {
  IntentReceiptV2: [
    { name: "intentHash", type: "bytes32" },
    { name: "constraintsHash", type: "bytes32" },
    { name: "routeHash", type: "bytes32" },
    { name: "outcomeHash", type: "bytes32" },
    { name: "evidenceHash", type: "bytes32" },
    { name: "metadataCommitment", type: "bytes32" },
    { name: "ciphertextPointer", type: "string" },
    { name: "privacyLevel", type: "uint8" },
    { name: "escrowId", type: "bytes32" },
    { name: "createdAt", type: "uint64" },
    { name: "expiry", type: "uint64" },
    { name: "solverId", type: "bytes32" }
  ]
};
function getEIP712Domain(chainId, hubAddress) {
  return {
    name: "IRSB IntentReceiptHub",
    version: "2",
    chainId,
    verifyingContract: hubAddress
  };
}
function buildReceiptV2FromX402(params) {
  const {
    payload,
    ciphertextPointer,
    privacyLevel = 1 /* SemiPublic */,
    escrowId,
    solverId
  } = params;
  const intentHash = computeIntentHash(payload.service, payload.request.requestId);
  const constraintsHash = computeTermsHash(payload.payment, payload.timing.expiry);
  const routeHash = computeRouteHash(payload.service);
  const evidenceHash = computeEvidenceHash(payload.payment.paymentRef);
  const metadataCommitment = computePayloadCommitment(payload);
  const receiptV2 = {
    intentHash,
    constraintsHash,
    routeHash,
    outcomeHash: payload.response.resultDigest,
    evidenceHash,
    metadataCommitment,
    ciphertextPointer: formatCiphertextPointer(ciphertextPointer),
    privacyLevel,
    escrowId: escrowId ?? ZeroHash,
    createdAt: BigInt(payload.timing.issuedAt),
    expiry: BigInt(payload.timing.expiry),
    solverId,
    solverSig: "0x",
    // To be filled after signing
    clientSig: "0x"
    // To be filled after signing
  };
  const signingPayloads = {
    solver: createSigningPayload(receiptV2, 11155111, ZeroHash),
    // Placeholder
    client: createSigningPayload(receiptV2, 11155111, ZeroHash)
    // Placeholder
  };
  return {
    receiptV2,
    signingPayloads,
    debug: {
      metadataCommitment,
      intentHash,
      constraintsHash,
      routeHash
    }
  };
}
function createSigningPayload(receipt, chainId, hubAddress) {
  return {
    domain: getEIP712Domain(chainId, hubAddress),
    types: RECEIPT_V2_TYPES,
    primaryType: "IntentReceiptV2",
    message: {
      intentHash: receipt.intentHash,
      constraintsHash: receipt.constraintsHash,
      routeHash: receipt.routeHash,
      outcomeHash: receipt.outcomeHash,
      evidenceHash: receipt.evidenceHash,
      metadataCommitment: receipt.metadataCommitment,
      ciphertextPointer: receipt.ciphertextPointer,
      privacyLevel: receipt.privacyLevel,
      escrowId: receipt.escrowId,
      createdAt: receipt.createdAt.toString(),
      expiry: receipt.expiry.toString(),
      solverId: receipt.solverId
    }
  };
}
function computeReceiptV2Id(receipt) {
  return keccak2562(
    solidityPacked2(
      [
        "bytes32",
        "bytes32",
        "bytes32",
        "bytes32",
        "bytes32",
        "bytes32",
        "string",
        "uint8",
        "bytes32",
        "uint64",
        "uint64",
        "bytes32"
      ],
      [
        receipt.intentHash,
        receipt.constraintsHash,
        receipt.routeHash,
        receipt.outcomeHash,
        receipt.evidenceHash,
        receipt.metadataCommitment,
        receipt.ciphertextPointer,
        receipt.privacyLevel,
        receipt.escrowId,
        receipt.createdAt,
        receipt.expiry,
        receipt.solverId
      ]
    )
  );
}
function buildReceiptV2WithConfig(params, chainId, hubAddress) {
  const result = buildReceiptV2FromX402(params);
  result.signingPayloads.solver = createSigningPayload(result.receiptV2, chainId, hubAddress);
  result.signingPayloads.client = createSigningPayload(result.receiptV2, chainId, hubAddress);
  return result;
}
function validateReceiptV2(receipt) {
  if (receipt.intentHash === ZeroHash) return false;
  if (receipt.constraintsHash === ZeroHash) return false;
  if (receipt.routeHash === ZeroHash) return false;
  if (receipt.outcomeHash === ZeroHash) return false;
  if (receipt.evidenceHash === ZeroHash) return false;
  if (receipt.metadataCommitment === ZeroHash) return false;
  if (receipt.solverId === ZeroHash) return false;
  if (receipt.expiry <= receipt.createdAt) return false;
  if (!receipt.ciphertextPointer || receipt.ciphertextPointer === "") return false;
  return true;
}

// src/signing.ts
import { Wallet, TypedDataEncoder, keccak256 as keccak2563, recoverAddress } from "ethers";
async function signAsService(receipt, privateKey, chainId, hubAddress) {
  const wallet = new Wallet(privateKey);
  const typedData = createSigningPayload(receipt, chainId, hubAddress);
  const signature = await wallet.signTypedData(
    typedData.domain,
    { IntentReceiptV2: typedData.types.IntentReceiptV2 },
    typedData.message
  );
  return signature;
}
async function signAsClient(receipt, privateKey, chainId, hubAddress) {
  return signAsService(receipt, privateKey, chainId, hubAddress);
}
async function signReceiptDual(receipt, solverPrivateKey, clientPrivateKey, chainId, hubAddress) {
  const [solverSig, clientSig] = await Promise.all([
    signAsService(receipt, solverPrivateKey, chainId, hubAddress),
    signAsClient(receipt, clientPrivateKey, chainId, hubAddress)
  ]);
  return {
    ...receipt,
    solverSig,
    clientSig
  };
}
function recoverSigner(receipt, signature, chainId, hubAddress) {
  const typedData = createSigningPayload(receipt, chainId, hubAddress);
  const domain = typedData.domain;
  const types = { IntentReceiptV2: typedData.types.IntentReceiptV2 };
  const message = typedData.message;
  const hash = TypedDataEncoder.hash(domain, types, message);
  return recoverAddress(hash, signature);
}
function verifySolverSignature(receipt, expectedSolver, chainId, hubAddress) {
  if (!receipt.solverSig || receipt.solverSig === "0x") {
    return false;
  }
  try {
    const recovered = recoverSigner(receipt, receipt.solverSig, chainId, hubAddress);
    return recovered.toLowerCase() === expectedSolver.toLowerCase();
  } catch {
    return false;
  }
}
function verifyClientSignature(receipt, expectedClient, chainId, hubAddress) {
  if (!receipt.clientSig || receipt.clientSig === "0x") {
    return false;
  }
  try {
    const recovered = recoverSigner(receipt, receipt.clientSig, chainId, hubAddress);
    return recovered.toLowerCase() === expectedClient.toLowerCase();
  } catch {
    return false;
  }
}
function getReceiptTypedDataHash(receipt, chainId, hubAddress) {
  const typedData = createSigningPayload(receipt, chainId, hubAddress);
  return TypedDataEncoder.hash(
    typedData.domain,
    { IntentReceiptV2: typedData.types.IntentReceiptV2 },
    typedData.message
  );
}
function getPersonalSignHash(receipt) {
  return keccak2563(
    new TextEncoder().encode(
      JSON.stringify({
        intentHash: receipt.intentHash,
        constraintsHash: receipt.constraintsHash,
        routeHash: receipt.routeHash,
        outcomeHash: receipt.outcomeHash,
        evidenceHash: receipt.evidenceHash,
        createdAt: receipt.createdAt.toString(),
        expiry: receipt.expiry.toString(),
        solverId: receipt.solverId
      })
    )
  );
}

// src/post.ts
import { JsonRpcProvider, Wallet as Wallet2, Contract, Interface } from "ethers";
var HUB_ABI = [
  "function postReceiptV2((bytes32 intentHash, bytes32 constraintsHash, bytes32 routeHash, bytes32 outcomeHash, bytes32 evidenceHash, bytes32 metadataCommitment, string ciphertextPointer, uint8 privacyLevel, bytes32 escrowId, uint64 createdAt, uint64 expiry, bytes32 solverId, bytes solverSig, bytes clientSig) receipt) returns (bytes32 receiptId)",
  "function postReceipt((bytes32 intentHash, bytes32 constraintsHash, bytes32 routeHash, bytes32 outcomeHash, bytes32 evidenceHash, uint64 createdAt, uint64 expiry, bytes32 solverId, bytes solverSig) receipt) returns (bytes32 receiptId)",
  "function computeReceiptId((bytes32 intentHash, bytes32 constraintsHash, bytes32 routeHash, bytes32 outcomeHash, bytes32 evidenceHash, uint64 createdAt, uint64 expiry, bytes32 solverId, bytes solverSig) receipt) view returns (bytes32)",
  "event ReceiptPosted(bytes32 indexed receiptId, bytes32 indexed intentHash, bytes32 indexed solverId, uint64 expiry)"
];
async function postReceiptV2(receipt, options) {
  const provider = new JsonRpcProvider(options.rpcUrl);
  const wallet = new Wallet2(options.solverSigner, provider);
  const hub = new Contract(options.hubAddress, HUB_ABI, wallet);
  const receiptStruct = {
    intentHash: receipt.intentHash,
    constraintsHash: receipt.constraintsHash,
    routeHash: receipt.routeHash,
    outcomeHash: receipt.outcomeHash,
    evidenceHash: receipt.evidenceHash,
    metadataCommitment: receipt.metadataCommitment,
    ciphertextPointer: receipt.ciphertextPointer,
    privacyLevel: receipt.privacyLevel,
    escrowId: receipt.escrowId,
    createdAt: receipt.createdAt,
    expiry: receipt.expiry,
    solverId: receipt.solverId,
    solverSig: receipt.solverSig,
    clientSig: receipt.clientSig
  };
  const tx = await hub.postReceiptV2(receiptStruct, {
    gasLimit: options.gasLimit
  });
  const txReceipt = await tx.wait();
  const iface = new Interface(HUB_ABI);
  const receiptPostedEvent = txReceipt.logs.map((log) => {
    try {
      return iface.parseLog(log);
    } catch (error) {
      console.debug("[x402-irsb] Log parsing skipped:", error instanceof Error ? error.message : error);
      return null;
    }
  }).find((parsed) => parsed?.name === "ReceiptPosted");
  const receiptId = receiptPostedEvent?.args?.receiptId ?? "";
  return {
    txHash: txReceipt.hash,
    receiptId,
    blockNumber: txReceipt.blockNumber,
    gasUsed: txReceipt.gasUsed
  };
}
async function postReceiptV2FromX402(params, options) {
  const provider = new JsonRpcProvider(options.rpcUrl);
  const network = await provider.getNetwork();
  const chainId = Number(network.chainId);
  const { receiptV2 } = buildReceiptV2WithConfig(params, chainId, options.hubAddress);
  let signedReceipt;
  if (options.clientSigner) {
    signedReceipt = await signReceiptDual(
      receiptV2,
      options.solverSigner,
      options.clientSigner,
      chainId,
      options.hubAddress
    );
  } else {
    const solverSig = await signAsService(
      receiptV2,
      options.solverSigner,
      chainId,
      options.hubAddress
    );
    signedReceipt = { ...receiptV2, solverSig };
  }
  return postReceiptV2(signedReceipt, options);
}
async function estimatePostGas(receipt, options) {
  const provider = new JsonRpcProvider(options.rpcUrl);
  const wallet = new Wallet2(options.solverSigner, provider);
  const hub = new Contract(options.hubAddress, HUB_ABI, wallet);
  const receiptStruct = {
    intentHash: receipt.intentHash,
    constraintsHash: receipt.constraintsHash,
    routeHash: receipt.routeHash,
    outcomeHash: receipt.outcomeHash,
    evidenceHash: receipt.evidenceHash,
    metadataCommitment: receipt.metadataCommitment,
    ciphertextPointer: receipt.ciphertextPointer,
    privacyLevel: receipt.privacyLevel,
    escrowId: receipt.escrowId,
    createdAt: receipt.createdAt,
    expiry: receipt.expiry,
    solverId: receipt.solverId,
    solverSig: receipt.solverSig,
    clientSig: receipt.clientSig
  };
  return hub.postReceiptV2.estimateGas(receiptStruct);
}
async function receiptExists(receiptId, rpcUrl, hubAddress) {
  const provider = new JsonRpcProvider(rpcUrl);
  const hub = new Contract(
    hubAddress,
    ["function getReceipt(bytes32 receiptId) view returns (tuple, uint8)"],
    provider
  );
  try {
    const [, status] = await hub.getReceipt(receiptId);
    return status !== 0;
  } catch (error) {
    console.error("[x402-irsb] Failed to check receipt existence:", error instanceof Error ? error.message : error);
    return false;
  }
}

// src/escrow.ts
import { JsonRpcProvider as JsonRpcProvider2, Wallet as Wallet3, Contract as Contract2, ZeroAddress, keccak256 as keccak2564, toUtf8Bytes as toUtf8Bytes2 } from "ethers";
var ESCROW_ABI = [
  "function createEscrow(bytes32 escrowId, bytes32 receiptId, address depositor) payable",
  "function createEscrowERC20(bytes32 escrowId, bytes32 receiptId, address depositor, address token, uint256 amount)",
  "function getEscrow(bytes32 escrowId) view returns (bytes32 receiptId, address depositor, address token, uint256 amount, uint8 status, uint64 createdAt, uint64 deadline)",
  "function release(bytes32 escrowId, address recipient)",
  "function refund(bytes32 escrowId)",
  "event EscrowCreated(bytes32 indexed escrowId, bytes32 indexed receiptId, address indexed depositor, address token, uint256 amount)",
  "event EscrowReleased(bytes32 indexed escrowId, address indexed recipient, uint256 amount)",
  "event EscrowRefunded(bytes32 indexed escrowId, address indexed depositor, uint256 amount)"
];
var ERC20_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)"
];
var EscrowStatus = /* @__PURE__ */ ((EscrowStatus2) => {
  EscrowStatus2[EscrowStatus2["Active"] = 0] = "Active";
  EscrowStatus2[EscrowStatus2["Released"] = 1] = "Released";
  EscrowStatus2[EscrowStatus2["Refunded"] = 2] = "Refunded";
  return EscrowStatus2;
})(EscrowStatus || {});
function generateEscrowId(paymentRef, chainId) {
  return keccak2564(toUtf8Bytes2(`escrow:${chainId}:${paymentRef}`));
}
function escrowIdFromPayment(payment, targetChainId) {
  return generateEscrowId(payment.paymentRef, targetChainId);
}
async function createNativeEscrow(params, escrowAddress, rpcUrl, signerKey) {
  const provider = new JsonRpcProvider2(rpcUrl);
  const wallet = new Wallet3(signerKey, provider);
  const escrow = new Contract2(escrowAddress, ESCROW_ABI, wallet);
  const tx = await escrow.createEscrow(
    params.escrowId,
    params.receiptId,
    params.depositor,
    { value: params.amount }
  );
  const receipt = await tx.wait();
  return {
    txHash: receipt.hash,
    escrowId: params.escrowId,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed
  };
}
async function createERC20Escrow(params, escrowAddress, rpcUrl, signerKey) {
  const provider = new JsonRpcProvider2(rpcUrl);
  const wallet = new Wallet3(signerKey, provider);
  const escrow = new Contract2(escrowAddress, ESCROW_ABI, wallet);
  const tx = await escrow.createEscrowERC20(
    params.escrowId,
    params.receiptId,
    params.depositor,
    params.token,
    params.amount
  );
  const receipt = await tx.wait();
  return {
    txHash: receipt.hash,
    escrowId: params.escrowId,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed
  };
}
async function approveERC20ForEscrow(tokenAddress, escrowAddress, amount, rpcUrl, signerKey) {
  const provider = new JsonRpcProvider2(rpcUrl);
  const wallet = new Wallet3(signerKey, provider);
  const token = new Contract2(tokenAddress, ERC20_ABI, wallet);
  const tx = await token.approve(escrowAddress, amount);
  const receipt = await tx.wait();
  return receipt.hash;
}
async function getEscrowInfo(escrowId, escrowAddress, rpcUrl) {
  const provider = new JsonRpcProvider2(rpcUrl);
  const escrow = new Contract2(escrowAddress, ESCROW_ABI, provider);
  try {
    const [receiptId, depositor, token, amount, status, createdAt, deadline] = await escrow.getEscrow(escrowId);
    if (depositor === ZeroAddress) {
      return null;
    }
    return {
      receiptId,
      depositor,
      token,
      amount,
      status,
      createdAt: Number(createdAt),
      deadline: Number(deadline)
    };
  } catch (error) {
    console.error("[x402-irsb] Failed to get escrow info:", error instanceof Error ? error.message : error);
    return null;
  }
}
async function canCreateEscrow(escrowId, escrowAddress, rpcUrl) {
  const info = await getEscrowInfo(escrowId, escrowAddress, rpcUrl);
  return info === null;
}
function calculateEscrowParams(payment, receiptId, depositor, targetChainId, deadlineOffset = 3600) {
  const escrowId = escrowIdFromPayment(payment, targetChainId);
  const now = Math.floor(Date.now() / 1e3);
  return {
    escrowId,
    receiptId,
    depositor,
    token: payment.asset === "ETH" ? ZeroAddress : payment.asset,
    amount: BigInt(payment.amount),
    deadline: BigInt(now + deadlineOffset)
  };
}
async function createEscrowFromX402(payment, receiptId, depositor, escrowAddress, rpcUrl, signerKey, targetChainId) {
  const params = calculateEscrowParams(payment, receiptId, depositor, targetChainId);
  if (params.token === ZeroAddress) {
    return createNativeEscrow(params, escrowAddress, rpcUrl, signerKey);
  } else {
    return createERC20Escrow(params, escrowAddress, rpcUrl, signerKey);
  }
}

// src/config.ts
var SEPOLIA_CONFIG = {
  chainId: 11155111,
  name: "sepolia",
  hubAddress: "0xD66A1e880AA3939CA066a9EA1dD37ad3d01D977c",
  registryAddress: "0xB6ab964832808E49635fF82D1996D6a888ecB745",
  disputeModuleAddress: "0x144DfEcB57B08471e2A75E78fc0d2A74A89DB79D",
  publicRpcUrl: "https://rpc.sepolia.org",
  explorerUrl: "https://sepolia.etherscan.io"
};
var NETWORK_CONFIGS = {
  [SEPOLIA_CONFIG.chainId]: SEPOLIA_CONFIG
};
function getNetworkConfig(chainId) {
  return NETWORK_CONFIGS[chainId];
}
function requireNetworkConfig(chainId) {
  const config = getNetworkConfig(chainId);
  if (!config) {
    const supported = Object.keys(NETWORK_CONFIGS).join(", ");
    throw new Error(`Unsupported chain ID: ${chainId}. Supported: ${supported}`);
  }
  return config;
}
function isSupportedChain(chainId) {
  return chainId in NETWORK_CONFIGS;
}
function getSupportedChainIds() {
  return Object.keys(NETWORK_CONFIGS).map(Number);
}
function getTransactionUrl(txHash, chainId) {
  const config = getNetworkConfig(chainId);
  if (!config?.explorerUrl) return void 0;
  return `${config.explorerUrl}/tx/${txHash}`;
}
function getAddressUrl(address, chainId) {
  const config = getNetworkConfig(chainId);
  if (!config?.explorerUrl) return void 0;
  return `${config.explorerUrl}/address/${address}`;
}
function getHubUrl(chainId) {
  const config = getNetworkConfig(chainId);
  if (!config?.explorerUrl) return void 0;
  return `${config.explorerUrl}/address/${config.hubAddress}`;
}
export {
  EscrowStatus,
  PrivacyLevel,
  RECEIPT_V2_TYPES,
  SEPOLIA_CONFIG,
  X402Mode,
  X402_PAYLOAD_VERSION,
  approveERC20ForEscrow,
  buildReceiptV2FromX402,
  buildReceiptV2WithConfig,
  calculateEscrowParams,
  canCreateEscrow,
  canonicalize,
  computeEvidenceHash,
  computeIntentHash,
  computePayloadCommitment,
  computeReceiptV2Id,
  computeRequestFingerprint,
  computeRouteHash,
  computeTermsHash,
  createERC20Escrow,
  createEscrowFromX402,
  createNativeEscrow,
  createPayload,
  createSigningPayload,
  escrowIdFromPayment,
  estimatePostGas,
  formatCiphertextPointer,
  generateEscrowId,
  generateNonce,
  getAddressUrl,
  getEIP712Domain,
  getEscrowInfo,
  getHubUrl,
  getNetworkConfig,
  getPersonalSignHash,
  getReceiptTypedDataHash,
  getSupportedChainIds,
  getTransactionUrl,
  isSupportedChain,
  isValidCID,
  postReceiptV2,
  postReceiptV2FromX402,
  receiptExists,
  recoverSigner,
  requireNetworkConfig,
  signAsClient,
  signAsService,
  signReceiptDual,
  validateReceiptV2,
  verifyClientSignature,
  verifyCommitment,
  verifySolverSignature
};
